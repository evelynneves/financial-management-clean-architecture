import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    orderBy,
} from "firebase/firestore";
import { Transaction } from "@/domain/entities/Transaction";
import { Investment } from "@/domain/entities/Investment";
import { UserData } from "@/domain/entities/UserData";

export async function getUserData(uid: string): Promise<UserData> {
    const db = getFirestore();

    const transactionsRef = collection(db, "users", uid, "transactions");
    const transactionsQuery = query(
        transactionsRef,
        orderBy("createdAt", "desc")
    );
    const transactionsSnap = await getDocs(transactionsQuery);
    const transactions = transactionsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Transaction[];

    const investmentsDocRef = doc(db, "users", uid, "investments", "summary");
    const investmentsSnap = await getDoc(investmentsDocRef);
    const investments = investmentsSnap.exists()
        ? (investmentsSnap.data() as Investment)
        : null;

    return { transactions, investments };
}
