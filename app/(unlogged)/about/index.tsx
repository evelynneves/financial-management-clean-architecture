/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function About() {
    return (
        <LinearGradient colors={["#004D61", "#ffffff"]} style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Em breve!</Text>
                    <Image
                        source={require("@/assets/images/coming_soon.png")}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <Text style={styles.subtitle}>
                        Essa funcionalidade está sendo preparada com carinho.
                    </Text>
                    <Text style={styles.note}>Fique ligado para novidades :)</Text>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        gap: 20,
    },
    title: {
        color: "#000",
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
    },
    image: {
        width: "100%",
        height: 200,
        alignItems: "center",
        justifyContent: "center",
    },
    subtitle: {
        color: "#000",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    note: {
        fontSize: 14,
        color: "#000",
        textAlign: "center",
        marginTop: 10,
    },
});
