/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
******************************************************************************/

import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    doc,
    updateDoc,
    getDoc,
    getFirestore,
    setDoc,
} from "firebase/firestore";

import { Transaction } from "./StatementCard";
import { auth } from "@/infrastructure/firebase/config";
import { useAuth } from "@/contexts/useAuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatCurrency, getEmptyInvestments, parseCurrency, parseInvestmentData, toCurrencyData } from "@/infrastructure/firebase/investments/helpers";
import { updateUserBalance } from "@/infrastructure/firebase/balance/updateUserBalance";


interface EditModalProps {
    visible: boolean;
    transaction: Transaction | null;
    onClose: () => void;
    onFinish: () => void;
}

export default function ConfirmEditModal({
    visible,
    transaction,
    onClose,
    onFinish,
}: EditModalProps) {
    const db = getFirestore();
    const { refreshUserData, userData } = useAuth();

    const [date, setDate] = useState(new Date());
    const [amount, setAmount] = useState("");
    const [availableAmount, setAvailableAmount] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (transaction) {
            const [year, month, day] = transaction.date.split("-");
            setDate(new Date(Number(year), Number(month) - 1, Number(day)));

            const amountValue =
                typeof transaction.amount === "number"
                    ? transaction.amount
                    : parseCurrency(transaction.amount ?? "");

            setAmount(formatCurrency(amountValue));

            if (transaction.type === "Resgate") {
                const data = userData?.investments;
                let available = 0;
                const current = amountValue;

                switch (transaction.investmentType) {
                    case "Fundos de investimento":
                        available =
                            parseCurrency(data?.variableIncome.investmentFunds?.toString() ?? "") + current;
                        break;
                    case "Tesouro Direto":
                        available =
                            parseCurrency(data?.fixedIncome.governmentBonds?.toString() ?? "") + current;
                        break;
                    case "Previdência Privada Fixa":
                        available =
                            parseCurrency(data?.fixedIncome.privatePensionFixed?.toString() ?? "") + current;
                        break;
                    case "Previdência Privada Variável":
                        available =
                            parseCurrency(
                                data?.variableIncome.privatePensionVariable?.toString() ?? "") + current;
                        break;
                    case "Bolsa de Valores":
                        available =
                            parseCurrency(
                                data?.variableIncome.stockMarket?.toString() ?? "") + current;
                        break;
                }

                setAvailableAmount(available);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transaction]);


    const handleAmountChange = (value: string) => {
        let onlyNumbers = value.replace(/\D/g, "");
        if (!onlyNumbers) {
            setAmount("");
            return;
        }
        const cents = parseInt(onlyNumbers);
        const formatted = `R$ ${(cents / 100).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
        })}`;
        setAmount(formatted);
    };

    const isValid = (): boolean => {
        const numericAmount = parseCurrency(amount);
        const maxAvailable =
            transaction?.type === "Resgate" ? availableAmount : Infinity;

        return numericAmount > 0 && numericAmount <= maxAvailable;
    };

    const handleSave = async () => {
        if (!transaction) return;

        try {
            setIsSaving(true);

            const uid = auth.currentUser?.uid;
            if (!uid || !transaction?.id) return;

            const transactionRef = doc(
                db,
                "users",
                uid,
                "transactions",
                transaction.id
            );
            const newAmount = parseCurrency(amount);
            const originalAmount = parseCurrency(transaction.amount.toString());
            const diff = newAmount - originalAmount;

            await updateDoc(transactionRef, {
                amount: newAmount,
                date: date.toISOString().split("T")[0],
            });

            if (
                transaction.type === "Investimento" ||
                transaction.type === "Resgate"
            ) {
                const delta = transaction.type === "Resgate" ? -diff : diff;

                const investmentsRef = doc(
                    db,
                    "users",
                    uid,
                    "investments",
                    "summary"
                );
                const snapshot = await getDoc(investmentsRef);
                const data = snapshot.exists()
                    ? parseInvestmentData(snapshot.data())
                    : getEmptyInvestments();

                switch (transaction.investmentType) {
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
                    data.fixedIncome.privatePensionFixed +
                    data.fixedIncome.governmentBonds;
                data.variableIncome.total =
                    data.variableIncome.investmentFunds +
                    data.variableIncome.privatePensionVariable +
                    data.variableIncome.stockMarket;
                data.totalAmount =
                    data.fixedIncome.total + data.variableIncome.total;

                await setDoc(investmentsRef, toCurrencyData(data));
            }

            await updateUserBalance(uid, transaction.isNegative ? -diff : diff);
            try {
                console.log("rmoveItem edit");
                await AsyncStorage.removeItem(`transactions:${uid}`);
                await AsyncStorage.removeItem(`balance:${uid}`);
            } catch (cacheError) {
                console.error("Erro enquanto removia o cache", cacheError);
            }
            await refreshUserData();
            onFinish();
        } catch (error) {
            console.error("Erro ao salvar edição da transação:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            visible={visible && transaction !== null}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Editar Transação</Text>

                    <Text style={styles.label}>Tipo de Transação</Text>
                    <TextInput
                        value={transaction?.type ?? ""}
                        editable={false}
                        style={[
                            styles.input,
                            { backgroundColor: "#eee", color: "#888" },
                        ]}
                    />

                    {(transaction?.type === "Investimento" ||
                        transaction?.type === "Resgate") && (
                        <>
                            <Text style={styles.label}>
                                Tipo de Investimento
                            </Text>
                            <TextInput
                                value={transaction?.investmentType ?? ""}
                                editable={false}
                                style={[
                                    styles.input,
                                    { backgroundColor: "#eee", color: "#888" },
                                ]}
                            />
                        </>
                    )}

                    <Text style={styles.label}>Data</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={styles.input}
                    >
                        <Text>{date.toLocaleDateString("pt-BR")}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            textColor="#004D61"
                            onChange={(_, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setDate(selectedDate);
                            }}
                        />
                    )}

                    <Text style={styles.label}>Valor</Text>
                    <TextInput
                        value={amount ?? ""}
                        onChangeText={handleAmountChange}
                        keyboardType="numeric"
                        maxLength={15}
                        style={[
                            styles.input,
                            transaction?.type === "Resgate" &&
                                parseCurrency(amount) > availableAmount && {
                                    borderColor: "red",
                                },
                        ]}
                    />

                    {transaction?.type === "Resgate" && (
                        <>
                            {parseCurrency(amount) > availableAmount ? (
                                <Text style={styles.errorText}>
                                    O valor não pode ser maior que o disponível
                                    para resgate
                                </Text>
                            ) : (
                                <Text style={styles.availableText}>
                                    Valor disponível para resgate: {" "}
                                    {formatCurrency(availableAmount)}
                                </Text>
                            )}
                        </>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.cancel,
                                isSaving && { opacity: 0.5 },
                            ]}
                            onPress={onClose}
                            disabled={isSaving}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.confirm,
                                (!isValid() || isSaving) && { opacity: 0.5 },
                            ]}
                            onPress={handleSave}
                            disabled={!isValid() || isSaving}
                        >
                            <Text style={styles.buttonText}>
                                {isSaving ? "Salvando..." : "Salvar"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

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
        alignItems: "stretch",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    label: {
        fontSize: 14,
        color: "#444",
        marginTop: 10,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#004D61",
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 10,
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
        color: "#fff",
        fontWeight: "bold",
    },
    errorText: {
        color: "#e57471",
        fontSize: 14,
        fontWeight: "bold",
        marginTop: -5,
        marginBottom: 10,
    },
    availableText: {
        color: "#47a138",
        fontSize: 14,
        fontWeight: "bold",
        marginTop: -5,
        marginBottom: 10,
    },
});

