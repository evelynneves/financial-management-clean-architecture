/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import { View, Text, Image, StyleSheet } from "react-native";

export default function Footer() {
    return (
        <View style={styles.footer}>
            <View style={styles.footerContainer}>
                <Text style={styles.footerTitle}>Serviços</Text>
                <Text style={styles.footerText}>Conta corrente</Text>
                <Text style={styles.footerText}>Conta PJ</Text>
                <Text style={styles.footerText}>Cartão de crédito</Text>
            </View>

            <View style={styles.footerContainer}>
                <Text style={styles.footerTitle}>Contato</Text>
                <Text style={styles.footerText}>0800 040 206 08</Text>
                <Text style={styles.footerText}>meajuda@bytebank.com.br</Text>
                <Text style={styles.footerText}>ouvidoria@bytebank.com.br</Text>
            </View>

            <View style={styles.footerContainer}>
                <Text style={styles.footerTitle}>Desenvolvido por Alura</Text>
                <Image
                    source={require("../../../assets/images/logo_footer.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <View style={styles.socialMediaContainer}>
                    <Image
                        style={styles.socialMediaIcon}
                        source={require("../../../assets/images/instagram_icon.png")}
                    />
                    <Image
                        style={styles.socialMediaIcon}
                        source={require("../../../assets/images/whatsapp_icon.png")}
                    />
                    <Image
                        style={styles.socialMediaIcon}
                        source={require("../../../assets/images/youtube_icon.png")}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        width: "100%",
        backgroundColor: "#000",
        alignItems: "center",
        padding: 30,
        gap: 50,
    },
    footerContainer: {
        gap: 8,
        alignItems: "center",
    },
    footerTitle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    footerText: {
        color: "#fff",
        fontSize: 16,
    },
    logo: {
        height: 32,
        marginTop: 10,
        alignSelf: "center",
    },
    socialMediaContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        gap: 25,
    },
    socialMediaIcon: {
        width: 30,
        height: 30,
    },
});