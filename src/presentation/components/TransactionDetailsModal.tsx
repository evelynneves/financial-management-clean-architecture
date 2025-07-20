/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";

import { Transaction } from "./StatementCard";
import { useAuth } from "@/contexts/useAuthContext";

interface DetailsModalProps {
    visible: boolean;
    transaction: Transaction | null;
    onClose: () => void;
}

export default function TransactionDetailsModal({
    visible,
    transaction,
    onClose,
}: DetailsModalProps) {
    const { user } = useAuth();
    
    if (!transaction) return null;

        function formatDate(dateString: string): string {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Detalhes da Transação</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>Tipo de Transação</Text>
                        <TextInput
                            style={styles.input}
                            editable={false}
                            value={transaction.type}
                        />
                    </View>

                    {transaction.investmentType && (
                        <View style={styles.field}>
                            <Text style={styles.label}>Tipo de Investimento</Text>
                            <TextInput
                                style={styles.input}
                                editable={false}
                                value={transaction.investmentType}
                            />
                        </View>
                    )}

                    <View style={styles.field}>
                        <Text style={styles.label}>Valor</Text>
                        <TextInput
                            style={styles.input}
                            editable={false}
                            value={`R$ ${transaction.amount.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                            })}`}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Data</Text>
                        <TextInput
                            style={styles.input}
                            editable={false}
                            value={formatDate(transaction.date)}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Autor</Text>
                        <TextInput
                            style={styles.input}
                            editable={false}
                            value={user?.displayName || "usuário"}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
    },
    field: {
        marginBottom: 10,
    },
    label: {
        fontSize: 13,
        color: "#333",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#004D61",
        borderRadius: 8,
        padding: 10,
        color: "#333",
    },
    button: {
        backgroundColor: "#004D61",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        marginTop: 15,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

