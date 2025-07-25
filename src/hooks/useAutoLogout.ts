import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/infrastructure/firebase/config";

const INACTIVITY_LIMIT_MINUTES = 30;
const LAST_ACTIVITY_KEY = "lastActivity";

const saveCurrentActivity = async () => {
    await AsyncStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
};

const hasSessionExpired = async (): Promise<boolean> => {
    const last = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);
    if (!last) return false;

    const diff = Date.now() - parseInt(last, 10);
    const minutes = diff / 1000 / 60;
    return minutes > INACTIVITY_LIMIT_MINUTES;
};

export const useAutoLogout = () => {
    const router = useRouter();

    useEffect(() => {
        const checkExpiration = async () => {
            const expired = await hasSessionExpired();
            if (expired && auth.currentUser) {
                await signOut(auth);
                router.replace("/(unlogged)");
            }
        };

        const init = async () => {
            await saveCurrentActivity();
            await checkExpiration();
        };

        const appStateListener = (state: AppStateStatus) => {
            if (state === "active") {
                init();
            }
        };

        const authListener = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await saveCurrentActivity();
            }
        });

        const subscription = AppState.addEventListener(
            "change",
            appStateListener
        );

        return () => {
            subscription.remove();
            authListener();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
