/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import TransactionDetailsModal from "./TransactionDetailsModal";
import ConfirmEditModal from "./ConfirmEditModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useAuth } from "@/contexts/useAuthContext";

export type TransactionType =
    | "Depósito"
    | "Transferência"
    | "Investimento"
    | "Resgate";

export interface Transaction {
    id?: string;
    month: string;
    date: string;
    type: TransactionType;
    amount: number;
    investmentType?: string;
    attachmentFileId: string | null;
    attachmentUrl: string | null;
    isNegative: boolean;
}

export default function StatementCard({
    transactions,
    onReload,
}: {
    transactions: Transaction[];
    onReload: () => void;
}) {
    const { refreshUserData } = useAuth();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const formatCurrency = (value: number, isNegative?: boolean): string => {
        const prefix = isNegative ? "- R$" : "R$";
        return `${prefix} ${value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
        })}`;
    };

    const handleOpenAttachment = async (url: string) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error("Erro ao abrir o comprovante:", error);
        }
    };

    function formatDate(dateString: string): string {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    }

    return (
        <View style={styles.card}>
            {transactions.map((item, index) => (
                <View key={index} style={styles.transaction}>
                    <View style={styles.row}>
                        <Text style={styles.month}>{item.month}</Text>
                        <View style={styles.iconGroup}>
                            {item.attachmentFileId && (
                                <TouchableOpacity
                                    onPress={() => handleOpenAttachment(item.attachmentUrl!)}
                                >
                                    <MaterialCommunityIcons
                                        name="paperclip"
                                        size={20}
                                        color="#004D61"
                                    />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedTransaction(item);
                                    setShowDetailsModal(true);
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="eye"
                                    size={20}
                                    color="#004D61"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedTransaction(item);
                                    setShowEditModal(true);
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="pencil"
                                    size={20}
                                    color="#004D61"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedTransaction(item);
                                    setShowConfirmModal(true);
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="trash-can"
                                    size={20}
                                    color="#004D61"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Text
                            style={[
                                styles.type,
                                item.isNegative && { color: "red" },
                            ]}
                        >
                            {item.type}
                        </Text>
                        <Text style={styles.date}>
                            {formatDate(item.date)}
                        </Text>
                    </View>

                    {item.investmentType && (
                        <Text style={styles.investmentType}>{item.investmentType}</Text>
                    )}

                    <Text
                        style={[
                            styles.amount,
                            item.isNegative
                                ? { color: "#f44336" }
                                : { color: "#000" },
                        ]}
                    >
                        {formatCurrency(item.amount, item.isNegative)}
                    </Text>

                    <View style={styles.separator} />
                </View>
            ))}

            <TransactionDetailsModal
                visible={showDetailsModal}
                transaction={selectedTransaction}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedTransaction(null);
                }}
            />

            <ConfirmEditModal
                visible={showEditModal}
                transaction={selectedTransaction}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedTransaction(null);
                }}
                onFinish={() => {
                    setShowEditModal(false);
                    setSelectedTransaction(null);
                    refreshUserData();
                    onReload();
                }}
            />

            <ConfirmDeleteModal
                visible={showConfirmModal}
                transaction={selectedTransaction}
                onClose={() => {
                    setShowConfirmModal(false);
                    setSelectedTransaction(null);
                }}
                onFinish={() => {
                    setShowConfirmModal(false);
                    setSelectedTransaction(null);
                    refreshUserData();
                    onReload();
                }}
                onReload={onReload}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 15,
    },
    iconGroup: {
        flexDirection: "row",
        gap: 8,
    },
    transaction: {
        gap: 4,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    month: {
        color: "#47A138",
        fontWeight: "bold",
        fontSize: 16,
    },
    date: {
        color: "#8B8B8B",
        fontSize: 13,
        fontWeight: "300",
    },
    type: {
        fontSize: 14,
        fontWeight: "600",
    },
    investmentType: {
        fontSize: 12,
        color: "#444",
    },
    amount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    separator: {
        height: 2,
        backgroundColor: "#47A138",
        marginTop: 8,
    },
});
