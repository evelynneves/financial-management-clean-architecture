/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    getFirestore,
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    where,
    getDocs,
} from "firebase/firestore";
import { useFocusEffect } from "expo-router";
import StatementCard, { Transaction } from "@/presentation/components/StatementCard";
import { auth } from "@/infrastructure/firebase/config";


const PAGE_SIZE = 5;
const transactionTypes = ["Resgate", "Investimento", "Transferência", "Depósito"];

export default function TransactionsScreen() {
    const db = getFirestore();
    const uid = auth.currentUser?.uid;

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            Keyboard.dismiss();
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    useEffect(() => {
        if (uid) {
            setTransactions([]);
            fetchTransactions(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, selectedTypes, selectedDate, uid]);

    useFocusEffect(
        useCallback(() => {
            fetchTransactions(true);

            return () => {
                setSelectedTypes([]);
                setSelectedDate(null);
                setSearchTerm("");
                setDebouncedSearchTerm("");
            };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    const toggleType = (type: string) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const buildQuery = (startDoc?: any) => {
        const baseRef = collection(db, "users", uid!, "transactions");
        let q: any = query(baseRef, orderBy("date", "desc"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));

        if (selectedTypes.length > 0) {
            q = query(q, where("type", "in", selectedTypes));
        }

        if (selectedDate) {
            const dateStr = selectedDate.toISOString().split("T")[0];
            q = query(q, where("date", "==", dateStr));
        }

        if (startDoc) {
            q = query(q, startAfter(startDoc));
        }

        return q;
    };

    async function fetchTransactions(initial = false) {
        try {
            if (!uid) return;
            if (initial) {
                setLoading(true);
                setLastDoc(null);
            } else {
                setLoadingMore(true);
            }

            const q = buildQuery(initial ? undefined : lastDoc);
            const snapshot = await getDocs(q);

            const docs = snapshot.docs.map((doc) => {
                const data = doc.data() as Record<string, any>;
                return {
                    ...data,
                    id: doc.id,
                } as Transaction;
            });

            const filtered = debouncedSearchTerm
                ? docs.filter((t) =>
                      String(t.amount)
                          .replace(/\D/g, "")
                          .includes(debouncedSearchTerm.replace(/\D/g, ""))
                  )
                : docs;

            setTransactions((prev) => [...(initial ? [] : prev), ...filtered]);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        } catch (err) {
            console.error("Erro ao buscar transações:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    }

    const handleRefresh = () => {
        setRefreshing(true);
        fetchTransactions(true);
    };

    const handleLoadMore = () => {
        if (!loadingMore && lastDoc) {
            fetchTransactions();
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
        >
            <View style={styles.cardContainer}>
                <View style={styles.headerSection}>
                    <Text style={styles.title}>Lista de Transações</Text>
                    <View style={styles.filters}>
                        <Pressable style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
                            <Text style={styles.filterText}>Filtrar por tipo</Text>
                            <MaterialCommunityIcons name="chevron-down" size={16} color="#004D61" />
                        </Pressable>

                        <View style={styles.dateWrapper}>
                            <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                                <Text style={styles.filterText}>
                                    {selectedDate ? selectedDate.toLocaleDateString("pt-BR") : "dd/mm/aaaa"}
                                </Text>
                                <MaterialCommunityIcons name="calendar" size={16} color="#004D61" />
                            </Pressable>
                            {selectedDate && (
                                <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.clearDateButton}>
                                    <MaterialCommunityIcons name="close-circle" size={20} color="#004D61" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <TextInput
                            placeholder="Buscar"
                            placeholderTextColor="#004D61"
                            style={styles.searchInput}
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            returnKeyType="search"
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />
                    </View>
                </View>

                <Modal transparent animationType="fade" visible={showFilterModal}>
                    <Pressable
                        style={styles.modalBackground}
                        onPress={() => setShowFilterModal(false)}
                    >
                        <View style={styles.modalContent}>
                            {transactionTypes.map((type) => (
                                <TouchableOpacity key={type} onPress={() => toggleType(type)}>
                                    <View style={styles.checkboxRow}>
                                        <MaterialCommunityIcons
                                            name={
                                                selectedTypes.includes(type)
                                                    ? "checkbox-marked"
                                                    : "checkbox-blank-outline"
                                            }
                                            size={20}
                                            color="#004D61"
                                        />
                                        <Text style={styles.checkboxLabel}>{type}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Pressable>
                </Modal>

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(_, date) => {
                            setShowDatePicker(false);
                            if (date) setSelectedDate(date);
                        }}
                    />
                )}

                {loading ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#004D61" />
                    </View>
                ) : transactions.length === 0 ? (
                    <Text style={styles.emptyMessage}>
                        {selectedTypes.length > 0 || debouncedSearchTerm || selectedDate
                            ? "😕 Nenhum resultado encontrado com os filtros aplicados."
                            : "🤖 Nenhuma transação por aqui ainda...\nVamos movimentar sua conta? 💸"}
                    </Text>
                ) : (
                    <FlatList
                        data={transactions}
                        keyExtractor={(item) => item.id!}
                        renderItem={({ item }) => (
                            <StatementCard transactions={[item]} onReload={handleRefresh} />
                        )}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        ListFooterComponent={
                            loadingMore ? <ActivityIndicator size="small" color="#004D61" /> : null
                        }
                        contentContainerStyle={styles.listContent}
                        keyboardShouldPersistTaps="handled"
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E4EDE3",
        padding: 30,
    },
    cardContainer: {
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 8,
        overflow: "hidden",
    },
    headerSection: {
        padding: 30,
        paddingBottom: 0,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        color: "#004D61",
        marginBottom: 10,
    },
    filters: {
        flexDirection: "row",
        gap: 10,
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderColor: "#004D61",
        borderRadius: 8,
        minWidth: "30%",
    },
    dateWrapper: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },
    clearDateButton: {
        marginLeft: 6,
        padding: 4,
    },
    dateInput: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderColor: "#004D61",
        borderRadius: 8,
        minWidth: "30%",
    },
    filterText: {
        color: "#004D61",
        marginRight: 4,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#004D61",
        borderRadius: 8,
        paddingHorizontal: 10,
        color: "#004D61",
        width: "100%",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "#00000088",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 8,
        width: "80%",
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 16,
        color: "#004D61",
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
        paddingHorizontal: 30,
        paddingTop: 10,
        paddingBottom: 60,
        gap: 20,
    },
});