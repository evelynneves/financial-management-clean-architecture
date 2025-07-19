/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
    getFirestore,
    collection,
    getDocs,
    orderBy,
    limit,
    startAfter,
    query,
    doc,
    getDoc,
} from "firebase/firestore";
import { useFocusEffect } from "expo-router";
import StatementCard, { Transaction } from "@/presentation/components/StatementCard";
import { useAuthStore } from "@/store/useAuthStore";

const PAGE_SIZE = 5;

export default function HomeScreen() {
    const { user } = useAuthStore();
    const db = getFirestore();
    const uid = user?.uid;

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [balance, setBalance] = useState<number | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(today);

    const fetchTransactions = async (initial = false) => {
        if (!uid) return;
        try {
            if (initial) {
                setLoading(true);
                setLastDoc(null);
            } else {
                setLoadingMore(true);
            }

            let baseQuery = query(
                collection(db, "users", uid, "transactions"),
                orderBy("date", "desc"),
                orderBy("createdAt", "desc"),
                limit(PAGE_SIZE)
            );

            if (!initial && lastDoc) {
                baseQuery = query(baseQuery, startAfter(lastDoc));
            }

            const snapshot = await getDocs(baseQuery);
            const newTransactions = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Transaction[];

            setTransactions((prev) => [...(initial ? [] : prev), ...newTransactions]);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        } catch (err) {
            console.error("Erro ao carregar transações da Home:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const fetchBalance = async () => {
        if (!uid) return;

        try {
            const summaryRef = doc(db, "users", uid, "summary", "totals");
            const snapshot = await getDoc(summaryRef);

            if (snapshot.exists()) {
                const data = snapshot.data();
                setBalance(typeof data.balance === "number" ? data.balance : 0);
            }
        } catch (err) {
            console.error("Erro ao buscar saldo:", err);
            setBalance(null);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTransactions(true);
            fetchBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [uid, refreshKey])
    );

    const handleReload = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleLoadMore = () => {
        if (!loadingMore && lastDoc) {
            fetchTransactions(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.greeting}>
                        Olá, {(user?.displayName?.split(" ")[0] || "usuário")}! :)
                    </Text>
                    <Text style={styles.date}>{formattedDate}</Text>

                    <View style={styles.balanceContainer}>
                        <View style={styles.balanceHeader}>
                            <Text style={styles.balanceLabel}>Saldo</Text>
                            <TouchableOpacity onPress={toggleVisibility}>
                                <MaterialCommunityIcons
                                    name={isVisible ? "eye" : "eye-off"}
                                    size={20}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.separator} />

                        <Text style={styles.accountType}>Conta Corrente</Text>
                        <Text style={styles.amount}>
                            {isVisible
                                ? balance !== null
                                    ? balance.toLocaleString("pt-BR", {
                                          style: "currency",
                                          currency: "BRL",
                                      })
                                    : "R$ 0,00"
                                : "••••••••"}
                        </Text>
                    </View>
                </View>

                <View style={styles.statementBox}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#004D61" style={{ marginTop: 40 }} />
                    ) : transactions.length === 0 ? (
                        <Text style={styles.emptyMessage}>
                            {"🤖 Nenhuma transação por aqui ainda...\nVamos movimentar sua conta? 💸"}
                        </Text>
                    ) : (
                        <FlatList
                            data={transactions}
                            keyExtractor={(item) => item.id!}
                            renderItem={({ item }) => (
                                <StatementCard transactions={[item]} onReload={handleReload} />
                            )}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={
                                loadingMore ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#004D61"
                                        style={{ marginTop: 20 }}
                                    />
                                ) : null
                            }
                            ListHeaderComponent={<Text style={styles.listTitle}>Extrato</Text>}
                            contentContainerStyle={styles.listContent}
                            keyboardShouldPersistTaps="handled"
                        />
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E4EDE3",
        padding: 30,
    },
    content: {
        flex: 1,
        gap: 40,
    },
    card: {
        backgroundColor: "#004D61",
        borderRadius: 8,
        padding: 20,
        gap: 10,
        alignItems: "center",
    },
    greeting: {
        color: "#fff",
        fontSize: 25,
        fontWeight: "500",
    },
    date: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "300",
        paddingBottom: 15,
        textTransform: "capitalize",
    },
    balanceContainer: {
        gap: 10,
    },
    balanceHeader: {
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
    },
    balanceLabel: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    separator: {
        height: 1,
        width: 180,
        backgroundColor: "#fff",
    },
    accountType: {
        color: "#fff",
        fontSize: 16,
    },
    amount: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    listTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center",
        paddingTop: 20,
        paddingBottom: 10,
    },
    statementBox: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
    },
    emptyMessage: {
        marginTop: 40,
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 24,
        paddingHorizontal: 30,
    },
    listContent: {
        padding: 20,
        gap: 20,
        flexGrow: 1,
    },
});
