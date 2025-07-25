import { doc, setDoc, getFirestore } from "firebase/firestore";
import { Investment } from "@/domain/entities/Investment";

export async function updateInvestmentSummary(uid: string, data: Investment): Promise<void> {
    const db = getFirestore();
    const investmentsRef = doc(db, "users", uid, "investments", "summary");
    await setDoc(investmentsRef, data, { merge: true });
}
