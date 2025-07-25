/******************************************************************************
 *                                                                             *
 * Creation Date : 16/04/2025                                                  *
 *                                                                             *
 * Property : (c) This program, code or item is the Intellectual Property of   *
 * Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
 * the express written authorization of Evelyn. All rights reserved.           *
 *                                                                             *
 *******************************************************************************/

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    getFirestore,
} from "firebase/firestore";
import { updateUserBalance } from "../balance/updateUserBalance";
import { Transaction } from "@/domain/entities/Transaction";
import { getEmptyInvestments, parseCurrency, parseInvestmentData, toCurrencyData } from "../investments/helpers";

const db = getFirestore();

export const updateTransaction = async (
    uid: string,
    transaction: Transaction,
    newAmount: number,
    newDate: string
) => {
    if (!transaction.id) return;

    const ref = doc(db, "users", uid, "transactions", transaction.id);

    const originalAmount = parseCurrency(String(transaction.amount));
    const diff = newAmount - originalAmount;

    await updateDoc(ref, { amount: newAmount, date: newDate });

    if (transaction.type === "Investimento" || transaction.type === "Resgate") {
        const delta = transaction.type === "Resgate" ? -diff : diff;

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

    const balanceDelta = transaction.isNegative ? -diff : diff;
    await updateUserBalance(uid, balanceDelta);
};
