import {
    getFirestore,
    doc,
    setDoc,
    collection,
    addDoc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    parseInvestmentData,
    toCurrencyData,
    getEmptyInvestments,
    parseCurrency,
} from "../investments/helpers";
import { updateUserBalance } from "../balance/updateUserBalance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction } from "@/domain/entities/Transaction";
import * as DocumentPicker from "expo-document-picker";

export const createTransaction = async (
    uid: string,
    transaction: Omit<Transaction, "id">,
    pdf?: DocumentPicker.DocumentPickerAsset | null
) => {
    const db = getFirestore();
    const storage = getStorage();
    let attachmentFileId: string | null = null;
    let attachmentUrl: string | null = null;

    if (pdf) {
        const filePath = `receipts/${uid}/${Date.now()}_${pdf.name}`;
        const response = await fetch(pdf.uri);
        const blob = await response.blob();
        const fileRef = ref(storage, filePath);

        await uploadBytes(fileRef, blob);
        attachmentFileId = filePath;
        attachmentUrl = await getDownloadURL(fileRef);
    }

    const newTransaction = {
        ...transaction,
        attachmentFileId,
        attachmentUrl,
        createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "users", uid, "transactions"), newTransaction);

    if (transaction.type === "Investimento" || transaction.type === "Resgate") {
        const investmentsRef = doc(db, "users", uid, "investments", "summary");
        const snapshot = await getDoc(investmentsRef);
        const data = snapshot.exists()
            ? parseInvestmentData(snapshot.data())
            : getEmptyInvestments();

        const numericAmount = parseCurrency(transaction.amount);
        const delta =
            newTransaction.type === "Resgate" ? -numericAmount : numericAmount;

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
        data.totalAmount = data.fixedIncome.total + data.variableIncome.total;

        await setDoc(investmentsRef, toCurrencyData(data));
    }

    try {
        await AsyncStorage.removeItem(`transactions:${uid}`);
        await AsyncStorage.removeItem(`balance:${uid}`);
    } catch (cacheError) {
        console.error("Erro ao limpar cache local:", cacheError);
    }

    const numericAmount = parseCurrency(transaction.amount);
    await updateUserBalance(
        uid,
        transaction.isNegative ? -numericAmount : numericAmount
    );
};
