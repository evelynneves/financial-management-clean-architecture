/******************************************************************************
 *                                                                             *
 * Creation Date : 16/04/2025                                                  *
 *                                                                             *
 * Property : (c) This program, code or item is the Intellectual Property of   *
 * Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
 * the express written authorization of Evelyn. All rights reserved.           *
 *                                                                             *
 ******************************************************************************/

import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserMenu from "@/presentation/components/UserMenu";
import { useAuth } from "@/contexts/useAuthContext";
import { useAutoLogout } from "@/hooks/useAutoLogout";

export default function LoggedLayout() {
    const { user, loading } = useAuth();
    const router = useRouter();
    useAutoLogout();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/(unlogged)");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, user]);

    if (loading || (!user && !loading)) {
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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Drawer
                    screenOptions={{
                        headerStyle: { backgroundColor: "#004D61", height: 60 },
                        headerLeftContainerStyle: {
                            alignItems: "center",
                            height: "100%",
                            paddingBottom: Platform.OS === "android" ? 25 : 0,
                        },
                        headerRightContainerStyle: {
                            alignItems: "center",
                            height: "100%",
                            paddingBottom: Platform.OS === "android" ? 25 : 0,
                        },
                        headerTintColor: "#FF5031",
                        headerTitle: "",
                        headerRight: () => <UserMenu />,
                        drawerStyle: {
                            backgroundColor: "#E4EDE3",
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                        },
                        drawerItemStyle: { borderRadius: 0 },
                        drawerLabelStyle: { fontWeight: "bold" },
                        drawerActiveTintColor: "#FF5031",
                        drawerInactiveTintColor: "#000000",
                        drawerActiveBackgroundColor: "transparent",
                    }}
                >
                    <Drawer.Screen
                        name="home/index"
                        options={{ drawerLabel: "Início", title: "" }}
                    />
                    <Drawer.Screen
                        name="new-transaction/index"
                        options={{ drawerLabel: "Nova Transação", title: "" }}
                    />
                    <Drawer.Screen
                        name="transactions/index"
                        options={{ drawerLabel: "Transações", title: "" }}
                    />
                    <Drawer.Screen
                        name="investments/index"
                        options={{ drawerLabel: "Investimentos", title: "" }}
                    />
                    <Drawer.Screen
                        name="services/index"
                        options={{ drawerLabel: "Outros serviços", title: "" }}
                    />
                </Drawer>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
