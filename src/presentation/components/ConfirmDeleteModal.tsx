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
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
    doc,
    getDoc,
    deleteDoc,
    getFirestore,
    setDoc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

import { Transaction } from "./StatementCard";
import { auth } from "@/infrastructure/firebase/config";
import { updateUserBalance } from "@/infrastructure/firebase/getBalance";
import { useAuth } from "@/contexts/useAuthContext";

interface ConfirmDeleteModalProps {
    visible: boolean;
    transaction: Transaction | null;
    onClose: () => void;
    onFinish: () => void;
    onReload: () => void;
}

export default function ConfirmDeleteModal({
    visible,
    transaction,
    onClose,
    onFinish,
    onReload,
}: ConfirmDeleteModalProps) {
    const { refreshUserData } = useAuth();
    const db = getFirestore();
    const storage = getStorage();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid || !transaction?.id) return;

        try {
            setIsDeleting(true);

            const transactionRef = doc(db, "users", uid, "transactions", transaction.id);
            const amount = transaction.amount;
            const type = transaction.type;
            const investmentType = transaction.investmentType;

            if (transaction.attachmentFileId) {
                const fileRef = ref(storage, transaction.attachmentFileId);
                await deleteObject(fileRef).catch((err) => {
                    console.warn("Falha ao excluir anexo:", err.message);
                });
            }

            if (type === "Investimento" || type === "Resgate") {
                const delta = type === "Investimento" ? -amount : amount;

                const investmentsRef = doc(db, "users", uid, "investments", "summary");
                const snapshot = await getDoc(investmentsRef);
                const data = snapshot.exists()
                    ? parseInvestmentData(snapshot.data())
                    : getEmptyInvestments();

                switch (investmentType) {
                    case "Fundos de investimento":
                        data.variableIncome.investmentFunds += delta;
                        break;
                    case "Tesouro Direto":
                        data.fixedIncome.governmentBonds += delta;
                        break;
                    case "Previdência Privada Fixa":
                        data.fixedIncome.privatePensionFixed += delta;
                        break;
                    case "Previdência Privada Variável":
                        data.variableIncome.privatePensionVariable += delta;
                        break;
                    case "Bolsa de Valores":
                        data.variableIncome.stockMarket += delta;
                        break;
                }

                data.fixedIncome.total =
                    data.fixedIncome.privatePensionFixed + data.fixedIncome.governmentBonds;
                data.variableIncome.total =
                    data.variableIncome.investmentFunds +
                    data.variableIncome.privatePensionVariable +
                    data.variableIncome.stockMarket;
                data.totalAmount = data.fixedIncome.total + data.variableIncome.total;

                await setDoc(investmentsRef, toCurrencyData(data));
            }

            await updateUserBalance(uid, transaction.isNegative ? transaction.amount : -transaction.amount);
            await deleteDoc(transactionRef);
            await refreshUserData();
            onFinish();
            onReload();
        } catch (err) {
            console.error("Erro ao deletar transação:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Confirmar Remoção</Text>
                    <Text style={styles.message}>
                        Você tem certeza que deseja remover esta transação?
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.cancel,
                                isDeleting && { opacity: 0.5 },
                            ]}
                            onPress={onClose}
                            disabled={isDeleting}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.confirm,
                                isDeleting && { opacity: 0.5 },
                            ]}
                            onPress={handleDelete}
                            disabled={isDeleting}
                        >
                            <Text style={styles.buttonText}>
                                {isDeleting ? "Removendo..." : "Confirmar"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const formatCurrency = (value: number, isNegative?: boolean): string => {
    const prefix = isNegative ? "- R$" : "R$";
    return `${prefix} ${value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
    })}`;
};

const getEmptyInvestments = () => ({
    totalAmount: 0,
    fixedIncome: {
        total: 0,
        governmentBonds: 0,
        privatePensionFixed: 0,
    },
    variableIncome: {
        total: 0,
        investmentFunds: 0,
        privatePensionVariable: 0,
        stockMarket: 0,
    },
});

const parseInvestmentData = (data: any) => ({
    totalAmount: parseFloat(data.totalAmount.replace(/[R$\.\s]/g, "").replace(",", ".")) || 0,
    fixedIncome: {
        total: parseFloat(data.fixedIncome.total.replace(/[R$\.\s]/g, "").replace(",", ".")) || 0,
        governmentBonds: parseFloat(data.fixedIncome.governmentBonds.replace(/[R$\.\s]/g, "").replace(",", ".")) || 0,
        privatePensionFixed: parseFloat( data.fixedIncome.privatePensionFixed .replace(/[R$\.\s]/g, "") .replace(",", ".") ) || 0,
    },
    variableIncome: {
        total: parseFloat(data.variableIncome.total.replace(/[R$\.\s]/g, "").replace(",", ".")) || 0,
        investmentFunds: parseFloat(data.variableIncome.investmentFunds.replace(/[R$\.\s]/g, "").replace(",", ".")) || 0,
        privatePensionVariable: parseFloat(data.variableIncome.privatePensionVariable.replace(/[R$\.\s]/g, "").replace(",", ".")) || 0,
        stockMarket:parseFloat(data.variableIncome.stockMarket.replace(/[R$\.\s]/g, "").replace(",", ".")) || 0,
    },
});

const toCurrencyData = (data: any) => ({
    totalAmount: formatCurrency(data.totalAmount),
    fixedIncome: {
        total: formatCurrency(data.fixedIncome.total),
        governmentBonds: formatCurrency(data.fixedIncome.governmentBonds),
        privatePensionFixed: formatCurrency(
            data.fixedIncome.privatePensionFixed
        ),
    },
    variableIncome: {
        total: formatCurrency(data.variableIncome.total),
        investmentFunds: formatCurrency(data.variableIncome.investmentFunds),
        privatePensionVariable: formatCurrency(
            data.variableIncome.privatePensionVariable
        ),
        stockMarket: formatCurrency(data.variableIncome.stockMarket),
    },
});

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 24,
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    message: {
        textAlign: "center",
        fontSize: 16,
        color: "#444",
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 6,
        alignItems: "center",
    },
    cancel: {
        backgroundColor: "#F44336",
    },
    confirm: {
        backgroundColor: "#004D61",
    },
    buttonText: {
        fontSize: 13,
        color: "#fff",
        fontWeight: "bold",
    },
});
