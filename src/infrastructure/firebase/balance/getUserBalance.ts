import { getFirestore, doc, getDoc } from "firebase/firestore";

function parseToNumber(value: any): number {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const cleaned = value.replace(/[^0-9,-]/g, "").replace(",", ".");
        return parseFloat(cleaned) || 0;
    }
    return 0;
}

export async function getUserBalance(uid: string): Promise<number> {
    const db = getFirestore();
    const summaryRef = doc(db, "users", uid, "summary", "totals");

    const snap = await getDoc(summaryRef);
    return snap.exists() ? parseToNumber(snap.data()?.balance) : 0;
}
