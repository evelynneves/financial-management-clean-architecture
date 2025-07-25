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
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { router, useFocusEffect } from "expo-router";

import { auth } from "@/infrastructure/firebase/config";
import ScreenWrapper from "@/presentation/components/ScreenWrapper";
import { useAuth } from "@/contexts/useAuthContext";
import { formatCurrency, parseCurrency } from "@/infrastructure/firebase/investments/helpers";
import { createTransaction } from "@/infrastructure/firebase/transactions/createTransaction";

const transactionTypes = [
    { label: "Depósito", value: "deposito" },
    { label: "Transferência", value: "transferencia" },
    { label: "Investimento", value: "investimento" },
    { label: "Resgate", value: "resgate" },
];

const investmentOptions = [
    { label: "Bolsa de Valores", value: "Bolsa de Valores" },
    { label: "Fundos de investimento", value: "Fundos de investimento" },
    { label: "Previdência Privada Fixa", value: "Previdência Privada Fixa" },
    { label: "Previdência Privada Variável", value: "Previdência Privada Variável" },
    { label: "Tesouro Direto", value: "Tesouro Direto" },
];

const NewTransactionScreen = () => {
    const [transactionType, setTransactionType] = useState("deposito");
    const [investmentType, setInvestmentType] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [amount, setAmount] = useState("");
    const [availableAmount, setAvailableAmount] = useState(0);
    const [pdf, setPdf] = useState<DocumentPicker.DocumentPickerAsset | null>(
        null
    );
    const { refreshUserData, userData } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInvestmentTypeChange = (value: string) => {
        setInvestmentType(value);
        const data = userData?.investments;
        if (!data) return;

        let available = 0;
        switch (value) {
            case "Fundos de investimento":
                available = parseCurrency(data.variableIncome.investmentFunds);
                break;
            case "Tesouro Direto":
                available = parseCurrency(data.fixedIncome.governmentBonds);
                break;
            case "Previdência Privada Fixa":
                available = parseCurrency(data.fixedIncome.privatePensionFixed);
                break;
            case "Previdência Privada Variável":
                available = parseCurrency(
                    data.variableIncome.privatePensionVariable
                );
                break;
            case "Bolsa de Valores":
                available = parseCurrency(data.variableIncome.stockMarket);
                break;
        }
        setAvailableAmount(available);
    };

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

    const isFormValid = (): boolean => {
        const parsedAmount = parseCurrency(amount);
        const isBasicValid = !!transactionType && !!date && parsedAmount > 0;
        const needsInvestmentType =
            transactionType === "investimento" || transactionType === "resgate";
        const validInvestmentType = !needsInvestmentType || !!investmentType;
        const validResgate =
            transactionType !== "resgate" || parsedAmount <= availableAmount;
        return isBasicValid && validInvestmentType && validResgate;
    };

    const handlePickPDF = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
                copyToCacheDirectory: true,
            });

            if (result.assets && result.assets[0]) {
                setPdf(result.assets[0]);
            }
        } catch (error) {
            console.error("Erro ao selecionar o arquivo PDF:", error);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const uid = auth.currentUser?.uid;
            if (!uid || !amount) return;

            const monthNames = [
                "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
            ];
            const month = monthNames[date.getMonth()];
            const formattedDate = date.toISOString().split("T")[0];
            const isNegative =
                transactionType !== "deposito" && transactionType !== "resgate";

            const transaction = {
                month,
                date: formattedDate,
                type:
                    transactionType === "deposito"
                        ? "Depósito"
                        : transactionType === "transferencia"
                        ? "Transferência"
                        : transactionType === "investimento"
                        ? "Investimento"
                        : "Resgate",
                amount,
                isNegative,
                ...(transactionType === "investimento" || transactionType === "resgate"
                    ? { investmentType }
                    : {}),
            };

            await createTransaction(uid, transaction, pdf);
            await refreshUserData();
            resetForm();
            router.replace("/home");
        } catch (err) {
            console.error("Erro ao salvar transação:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setTransactionType("deposito");
        setInvestmentType("");
        setAmount("");
        setDate(new Date());
        setPdf(null);
    };

    useFocusEffect(
        useCallback(() => {
            return () => {
                resetForm();
            };
        }, [])
    );

    const pickerStyles = {
        inputIOS: pickerSelectStyles.inputIOS,
        inputAndroid: pickerSelectStyles.inputAndroid,
        inputWeb: pickerSelectStyles.inputWeb,
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={styles.title}>Nova transação</Text>
                <Text style={styles.label}>Selecione o tipo de transação</Text>
                <View style={styles.pickerWrapper}>
                    <RNPickerSelect
                        placeholder={{
                            label: "Selecione um tipo",
                            value: null,
                        }}
                        onValueChange={setTransactionType}
                        value={transactionType}
                        items={transactionTypes}
                        style={pickerStyles}
                        useNativeAndroidPickerStyle={false}
                    />
                </View>

                {(transactionType === "investimento" ||
                    transactionType === "resgate") && (
                    <>
                        <Text style={styles.label}>
                            {transactionType === "resgate"
                                ? "De qual investimento deseja resgatar?"
                                : "Tipo de Investimento"}
                        </Text>
                        <View style={styles.pickerWrapper}>
                            <RNPickerSelect
                                placeholder={{
                                    label: "Selecione um tipo",
                                    value: null,
                                }}
                                onValueChange={handleInvestmentTypeChange}
                                value={investmentType}
                                items={investmentOptions}
                                style={pickerStyles}
                                useNativeAndroidPickerStyle={false}
                            />
                        </View>
                    </>
                )}

                <Text style={styles.label}>Data</Text>
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateInput}
                >
                    <Text>{date.toLocaleDateString("pt-BR")}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(_, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setDate(selectedDate);
                        }}
                    />
                )}

                <Text style={styles.label}>Valor</Text>
                <TextInput
                    value={amount}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                    placeholder="R$ 0,00"
                    maxLength={15}
                    style={[
                        styles.input,
                        transactionType === "resgate" &&
                            parseCurrency(amount) > availableAmount && {
                                borderColor: "red",
                            },
                    ]}
                />

                {transactionType === "resgate" && investmentType && (
                    <>
                        {parseCurrency(amount) > availableAmount ? (
                            <Text style={styles.errorText}>
                                O valor não pode ser maior que o disponível para
                                resgate
                            </Text>
                        ) : (
                            <Text style={styles.availableText}>
                                Valor disponível para resgate:{" "}
                                {formatCurrency(availableAmount)}
                            </Text>
                        )}
                    </>
                )}

                <Text style={styles.label}>Anexar comprovante (opcional)</Text>
                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handlePickPDF}
                >
                    <Text style={styles.uploadText} numberOfLines={1}>
                        {pdf ? pdf.name : "Escolher arquivo"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        (!isFormValid() || isSubmitting) && { opacity: 0.5 },
                    ]}
                    onPress={handleSubmit}
                    disabled={!isFormValid() || isSubmitting}
                >
                    <Text style={styles.submitText}>
                        {isSubmitting ? "Salvando..." : "Concluir transação"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

export default NewTransactionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        borderRadius: 8,
        backgroundColor: "#CBCBCB",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#000",
    },
    label: {
        fontSize: 16,
        color: "#444444",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#004D61",
        color: "#444444",
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#fff",
        fontSize: 16,
        marginBottom: 20,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: "#004D61",
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 20,
    },
    uploadButton: {
        borderWidth: 1,
        borderColor: "#004D61",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
    },
    uploadText: {
        color: "#004D61",
        fontSize: 16,
        fontWeight: "500",
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    submitButton: {
        backgroundColor: "#004D61",
        padding: 15,
        borderRadius: 6,
        marginTop: 20,
        alignItems: "center",
    },
    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    errorText: {
        color: "#e57471",
        fontSize: 14,
        fontWeight: "bold",
        marginTop: -20,
        marginBottom: 10,
    },
    availableText: {
        color: "#47a138",
        fontSize: 14,
        fontWeight: "bold",
        marginTop: -20,
        marginBottom: 10,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#004D61",
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === "android" ? 4 : 0,
        height: 48,
        justifyContent: "center", 
    },
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        color: "#004D61",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    inputAndroid: {
        fontSize: 16,
        color: "#004D61",
        paddingVertical: 8,
        backgroundColor: "transparent",
    },
    inputWeb: {
        fontSize: 16,
        padding: 10,
        color: "#004D61",
    },
};
