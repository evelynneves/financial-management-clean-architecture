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
import { ScrollView, StyleSheet } from "react-native";

export default function ScreenWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {children}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#E4EDE3",
        padding: 30,
    },
});
