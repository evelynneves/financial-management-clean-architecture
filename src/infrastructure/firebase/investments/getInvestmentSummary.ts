/******************************************************************************
 *                                                                             *
 * Creation Date : 16/04/2025                                                  *
 *                                                                             *
 * Property : (c) This program, code or item is the Intellectual Property of   *
 * Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
 * the express written authorization of Evelyn. All rights reserved.           *
 *                                                                             *
 *******************************************************************************/

import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Investment } from "@/domain/entities/Investment";

export async function getInvestmentSummary(uid: string): Promise<Investment | null> {
    const db = getFirestore();
    const investmentsRef = doc(db, "users", uid, "investments", "summary");
    const snapshot = await getDoc(investmentsRef);

    return snapshot.exists() ? (snapshot.data() as Investment) : null;
}
