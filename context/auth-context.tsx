/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    User,
} from "firebase/auth";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    orderBy,
} from "firebase/firestore";
import { useRouter } from "expo-router";

import { auth } from "@/firebase/config";

type Transaction = {
    month: string;
    date: string;
    type: string;
    amount: string;
    investmentType?: string;
    attachmentFileId?: string;
    isNegative?: boolean;
};

type Investment = {
    totalAmount: string;
    fixedIncome: {
        total: string;
        governmentBonds: string;
        privatePensionFixed: string;
        fixedIncomeFunds: string;
    };
    variableIncome: {
        total: string;
        privatePensionVariable: string;
        stockMarket: string;
        investmentFunds: string;
    };
};

type UserData = {
    transactions: Transaction[];
    investments: Investment | null;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    userData: UserData | null;
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);

            if (firebaseUser) {
                const data = await getUserData(firebaseUser.uid);
                setUserData(data);
            } else {
                setUserData(null);
            }
        });

        return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const data = await getUserData(result.user.uid);
            setUserData(data);
            router.replace("/home");
        } catch (error: any) {
            console.error("Login error:", error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUserData(null);
            router.replace("/");
        } catch (error: any) {
            console.error("Logout error:", error.message);
            throw error;
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(userCredential.user, {
                displayName: name,
            });
            setUser({ ...userCredential.user, displayName: name });

            const data = await getUserData(userCredential.user.uid);
            setUserData(data);
            router.replace("/home");
        } catch (error: any) {
            console.error("SignUp error:", error);
            throw error;
        }
    };

    const refreshUserData = async () => {
        if (!auth.currentUser) return;
        const data = await getUserData(auth.currentUser.uid);
        setUserData(data);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                userData,
                setUserData,
                refreshUserData,
                login,
                logout,
                signUp,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext)!;

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
    })) as unknown as Transaction[];

    const investmentsDocRef = doc(db, "users", uid, "investments", "summary");
    const investmentsSnap = await getDoc(investmentsDocRef);
    const investments = investmentsSnap.exists()
        ? (investmentsSnap.data() as Investment)
        : null;

    return { transactions, investments };
}

export default AuthContext;
