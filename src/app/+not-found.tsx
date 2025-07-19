/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import { useRouter } from "expo-router";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Footer from "../presentation/components/Footer";

export default function NotFoundPage() {
    const router = useRouter();

    return (
        <LinearGradient colors={["#004D61", "#ffffff"]} style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "space-between",
                }}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>
                        Ops! Não encontramos a página...
                    </Text>
                    <Text style={styles.description}>
                        E olha que exploramos o universo procurando por ela!
                        {"\n"}
                        Que tal voltar e tentar novamente?
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.replace("/")}
                    >
                        <Text style={styles.buttonText}>Voltar ao início</Text>
                    </TouchableOpacity>

                    <Image
                        source={require("../../assets/images/illustration_404.png")}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                <Footer />
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    content: {
        alignItems: "center",
        padding: 30,
        gap: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
    },
    button: {
        backgroundColor: "#E53935",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    illustration: {
        width: 300,
        height: 200,
        marginTop: 10,
    },
});
