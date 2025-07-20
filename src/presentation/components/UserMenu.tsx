/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import { useAuth } from "@/contexts/useAuthContext";
import React, { useState, useRef, useEffect } from "react";
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Modal,
    Animated,
    View,
} from "react-native";

export default function UserMenu() {
    const [visible, setVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-150)).current;
    const { logout } = useAuth();

    const handleLogout = () => {
        setVisible(false);
        logout?.();
    };

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        } else {
            slideAnim.setValue(-150);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    return (
        <>
            <TouchableOpacity style={{ height: "100%", alignItems: "center", justifyContent: "center" }} onPress={() => setVisible(true)}>
                <Image
                    source={require("../../../assets/images/avatar.png")}
                    style={{ width: 40, height: 40, marginRight: 25 }}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent
                animationType="none"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPressOut={() => setVisible(false)}
                >
                    <Animated.View
                        style={[
                            styles.menu,
                            { transform: [{ translateY: slideAnim }] },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={() => setVisible(false)}
                        >
                            <Text style={styles.closeText}>×</Text>
                        </TouchableOpacity>
                        <View style={styles.menuContainer}>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <Text style={styles.menuItem}>Minha conta</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <Text style={styles.menuItem}>Configurações</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleLogout}>
                                <Text style={styles.menuItem}>Sair</Text>
                        </TouchableOpacity>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "flex-start",
        paddingTop: 60,
        paddingRight: 20,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    menu: {
        backgroundColor: "#000",
        borderRadius: 8,
        paddingHorizontal: 15,
        minWidth: 150,
        elevation: 10,
    },
    menuContainer: {
        alignItems: 'center',
        gap: 10,
        paddingBottom: 10,
    },
    closeIcon: {
        alignItems: 'flex-end',

    },
    closeText: {
        color: "#47A138",
        fontSize: 30,
        fontWeight: "bold",
    },
    menuItem: {
        color: "#fff",
        fontSize: 18,
    },
});
