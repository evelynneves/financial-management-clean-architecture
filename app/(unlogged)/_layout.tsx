/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import { Drawer } from "expo-router/drawer";
import { Image, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UnloggedLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Drawer
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: "#000000",
                            height: 60,
                        },
                        headerLeftContainerStyle: {
                            alignItems: "center",
                            height: "100%",
                            paddingBottom: Platform.OS === "android" ? 25 : 0,
                        },
                        headerRightContainerStyle: {
                            justifyContent: "flex-start",
                            height: "100%",
                            paddingBottom: Platform.OS === "android" ? 25 : 0,
                        },
                        headerTintColor: "#47A138",
                        headerTitle: "",
                        headerRight: () => (
                            <Image
                                source={require("@/assets/images/logo.png")}
                                style={{
                                    height: 60,
                                    marginRight: 16,
                                }}
                                resizeMode="contain"
                            />
                        ),
                        drawerStyle: {
                            backgroundColor: "#E4EDE3",
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                        },
                        drawerItemStyle: {
                            borderRadius: 0,
                        },
                        drawerLabelStyle: {
                            fontWeight: "bold",
                        },
                        drawerActiveTintColor: "#FF5031",
                        drawerInactiveTintColor: "#000000",
                        drawerActiveBackgroundColor: "transparent",
                    }}
                >
                    <Drawer.Screen
                        name="index"
                        options={{
                            drawerLabel: "Início",
                            title: "",
                        }}
                    />
                    <Drawer.Screen
                        name="about/index"
                        options={{
                            drawerLabel: "Sobre",
                            title: "",
                        }}
                    />
                    <Drawer.Screen
                        name="services/index"
                        options={{
                            drawerLabel: "Serviços",
                            title: "",
                        }}
                    />
                </Drawer>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
