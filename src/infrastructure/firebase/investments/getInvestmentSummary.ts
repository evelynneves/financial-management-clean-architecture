import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Investment } from "@/domain/entities/Investment";

export async function getInvestmentSummary(uid: string): Promise<Investment | null> {
    const db = getFirestore();
    const investmentsRef = doc(db, "users", uid, "investments", "summary");
    const snapshot = await getDoc(investmentsRef);

    return snapshot.exists() ? (snapshot.data() as Investment) : null;
}
