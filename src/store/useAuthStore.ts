import { create } from "zustand";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
    User,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/infrastructure/firebase/config";
import { getUserData } from "@/infrastructure/firebase/getUserData";
import { UserData } from "@/domain/entities/UserData";
import { router } from "expo-router";

interface AuthState {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    refreshUserData: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
    // init listener
    onAuthStateChanged(auth, async (firebaseUser) => {
        set({ user: firebaseUser, loading: false });

        if (firebaseUser) {
            const data = await getUserData(firebaseUser.uid);
            set({ userData: data });
        } else {
            set({ userData: null });
        }
    });

    return {
        user: null,
        userData: null,
        loading: true,

        login: async (email, password) => {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const data = await getUserData(result.user.uid);
            set({ user: result.user, userData: data });
            router.replace("/home");
        },

        logout: async () => {
            await signOut(auth);
            set({ user: null, userData: null });
            router.replace("/");
        },

        signUp: async (email, password, name) => {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(result.user, { displayName: name });
            const data = await getUserData(result.user.uid);
            set({ user: result.user, userData: data });
            router.replace("/home");
        },

        refreshUserData: async () => {
            const user = auth.currentUser;
            if (!user) return;
            const data = await getUserData(user.uid);
            set({ userData: data });
        },
    };
});
