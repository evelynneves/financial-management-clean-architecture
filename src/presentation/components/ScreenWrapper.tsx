/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import React from "react";
import {
    ScrollView,
    StyleSheet,
    GestureResponderEvent,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_ACTIVITY_KEY = "lastActivity";

export default function ScreenWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const handleTouch = async (_event: GestureResponderEvent) => {
        await AsyncStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    };

    return (
        <TouchableWithoutFeedback
            onPressIn={handleTouch}
            onPress={Keyboard.dismiss}
            accessible={false}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                {children}
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#E4EDE3",
        padding: 30,
    },
});
