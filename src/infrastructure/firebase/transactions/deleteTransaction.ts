import {
    doc,
    deleteDoc,
    getDoc,
    setDoc,
    getFirestore,
} from "firebase/firestore";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { updateUserBalance } from "../balance/updateUserBalance";

import { Transaction } from "@/domain/entities/Transaction";
import {
    getEmptyInvestments,
    parseInvestmentData,
    toCurrencyData,
    parseCurrency,
} from "../investments/helpers";

const db = getFirestore();
const storage = getStorage();

export const deleteTransaction = async (
    uid: string,
    transaction: Transaction
) => {
    if (!transaction.id) return;

    const transactionRef = doc(db, "users", uid, "transactions", transaction.id);

    if (transaction.attachmentFileId) {
        const fileRef = storageRef(storage, transaction.attachmentFileId);
        await deleteObject(fileRef).catch(() => null);
    }

    if (transaction.type === "Investimento" || transaction.type === "Resgate") {
        const rawAmount = parseCurrency(String(transaction.amount));
        const delta = transaction.type === "Investimento" ? -rawAmount : rawAmount;

        const investmentsRef = doc(db, "users", uid, "investments", "summary");
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
        data.totalAmount = data.fixedIncome.total + data.variableIncome.total;

        await setDoc(investmentsRef, toCurrencyData(data));
    }

    // Atualizar saldo
    const parsedAmount = parseCurrency(String(transaction.amount));
    const balanceDelta = transaction.isNegative ? parsedAmount : -parsedAmount;
    await updateUserBalance(uid, balanceDelta);

    // Remover transação
    await deleteDoc(transactionRef);
};
