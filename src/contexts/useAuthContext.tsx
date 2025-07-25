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
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
    onAuthStateChanged,
    User,
} from "firebase/auth";
import { auth } from "@/infrastructure/firebase/config";
import { getUserData } from "@/infrastructure/firebase/getUserData";
import { UserData } from "@/domain/entities/UserData";
import { router } from "expo-router";
import { fetchWithCache } from "@/utils/fetchWithCache";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                const data = await fetchWithCache(
                    `userData:${firebaseUser.uid}`,
                    () => getUserData(firebaseUser.uid),
                    300
                );
                setUserData(data);
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        const result = await signInWithEmailAndPassword(auth, email, password);
        const data = await getUserData(result.user.uid);
        setUser(result.user);
        setUserData(data);
        setLoading(false);
        router.replace("/home");
    };

    const logout = async () => {
        setLoading(true);
        try {
            await AsyncStorage.removeItem(`userData:${user?.uid}`);
        } catch (error) {
            console.warn("Error while removing user cache:", error);
        } 
        await signOut(auth);
        setUser(null);
        setUserData(null);
        setLoading(false);
        router.replace("/");
    };

    const signUp = async (email: string, password: string, name: string) => {
        setLoading(true);
        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        await updateProfile(result.user, { displayName: name });
        const data = await getUserData(result.user.uid);
        setUser(result.user);
        setUserData(data);
        setLoading(false);
        router.replace("/home");
    };

    const refreshUserData = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const data = await getUserData(currentUser.uid);
        setUserData(data);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userData,
                loading,
                login,
                logout,
                signUp,
                refreshUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
