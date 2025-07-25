/******************************************************************************
 *                                                                             *
 * Creation Date : 16/04/2025                                                  *
 *                                                                             *
 * Property : (c) This program, code or item is the Intellectual Property of   *
 * Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
 * the express written authorization of Evelyn. All rights reserved.           *
 *                                                                             *
 *******************************************************************************/

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
