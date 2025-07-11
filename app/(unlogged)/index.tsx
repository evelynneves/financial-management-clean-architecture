/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageSourcePropType,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

import Footer from "../../components/Footer";
import SignupModal from "@/components/SignupModal";
import LoginModal from "@/components/LoginModal";

export default function Index() {
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    return (
        <LinearGradient colors={["#004D61", "#ffffff"]} style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        Experimente mais liberdade no controle da sua vida
                        financeira. Crie sua conta com a gente!
                    </Text>

                    <View style={styles.illustrationContainer}>
                        <Image
                            style={styles.illustration}
                            resizeMode= "contain"
                            source={require("@/assets/images/illustration_banner.png")}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => setShowSignup(true)}
                        >
                            <Text style={styles.primaryButtonText}>
                                Abrir conta
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => setShowLogin(true)}
                        >
                            <Text style={styles.secondaryButtonText}>
                                Já tenho conta
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.features}>
                        <Text style={styles.subtitle}>
                            Vantagens do nosso banco:
                        </Text>

                        <Feature
                            icon={require("@/assets/images/gift_icon.png")}
                            title="Conta e cartão gratuitos"
                            description="Isso mesmo, nossa conta é digital, sem custo fixo e mais que isso: sem tarifa de manutenção."
                        />
                        <Feature
                            icon={require("@/assets/images/withdraw_icon.png")}
                            title="Saques sem custo"
                            description="Você pode sacar gratuitamente 4x por mês de qualquer Banco 24h."
                        />
                        <Feature
                            icon={require("@/assets/images/points_icon.png")}
                            title="Programa de pontos"
                            description="Você pode acumular pontos com suas compras no crédito sem pagar mensalidade!"
                        />
                        <Feature
                            icon={require("@/assets/images/devices_icon.png")}
                            title="Seguro Dispositivos"
                            description="Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica."
                        />
                    </View>
                </View>

                <Footer />
            </ScrollView>

            <LoginModal
                visible={showLogin}
                onClose={() => setShowLogin(false)}
            />
            <SignupModal
                visible={showSignup}
                onClose={() => setShowSignup(false)}
            />
        </LinearGradient>
    );
}

type FeatureProps = {
    icon: ImageSourcePropType;
    title: string;
    description: string;
};

function Feature({ icon, title, description }: FeatureProps) {
    return (
        <View style={styles.featureCard}>
            <Image source={icon} style={styles.featureIcon} />
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDescription}>{description}</Text>
        </View>
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
    illustrationContainer: {
        width: "100%",
        height: 200,
        alignItems: "center",
        justifyContent: "center",
    },
    illustration: {
        height: 200,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
    },
    primaryButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: 144,
        height: 48,
        backgroundColor: "#000",
        borderRadius: 8,
    },
    primaryButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    secondaryButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: 144,
        height: 48,
        backgroundColor: "transparent",
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 8,
    },
    secondaryButtonText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
    },
    subtitle: {
        color: "#000",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    features: {
        width: "100%",
        paddingTop: 20,
        gap: 30,
    },
    featureCard: {
        alignItems: "center",
        marginBottom: 24,
        gap: 10,
    },
    featureIcon: {
        width: 73,
        height: 56,
        marginBottom: 8,
    },
    featureTitle: {
        color: "#47A138",
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
    },
    featureDescription: {
        color: "#767676",
        fontSize: 16,
        textAlign: "center",
    },
});
