/******************************************************************************
 *                                                                             *
 * Creation Date : 16/04/2025                                                  *
 *                                                                             *
 * Property : (c) This program, code or item is the Intellectual Property of   *
 * Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
 * the express written authorization of Evelyn. All rights reserved.           *
 *                                                                             *
 *******************************************************************************/

import { doc, setDoc, getFirestore } from "firebase/firestore";
import { Investment } from "@/domain/entities/Investment";

export async function updateInvestmentSummary(uid: string, data: Investment): Promise<void> {
    const db = getFirestore();
    const investmentsRef = doc(db, "users", uid, "investments", "summary");
    await setDoc(investmentsRef, data, { merge: true });
}
