import { Slot } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import useCachedResources from "@/hooks/useCachedResources";
import { AuthProvider } from "@/contexts/useAuthContext";

export default function RootLayout() {
    const isLoadingComplete = useCachedResources();

    if (!isLoadingComplete) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color="#004D61" />
            </View>
        );
    }

    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    );
}
