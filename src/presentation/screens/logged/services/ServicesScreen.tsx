/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import ScreenWrapper from "@/presentation/components/ScreenWrapper";
import { useState } from "react";
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
} from "react-native";

export default function ServicesScreen() {
    const [selected, setSelected] = useState<string | null>(null);

    const services = [
        {
            id: "1",
            title: "Empréstimo",
            icon: require("../../../../../assets/images/loan_icon.png"),
        },
        {
            id: "2",
            title: "Meus cartões",
            icon: require("../../../../../assets/images/card_icon.png"),
        },
        {
            id: "3",
            title: "Doações",
            icon: require("../../../../../assets/images/donations_icon.png"),
        },
        {
            id: "4",
            title: "Pix",
            icon: require("../../../../../assets/images/pix_icon.png"),
        },
        {
            id: "5",
            title: "Seguros",
            icon: require("../../../../../assets/images/insurance_icon.png"),
        },
        {
            id: "6",
            title: "Crédito celular",
            icon: require("../../../../../assets/images/cell_phone_credit_icon.png"),
        },
    ];

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Confira os serviços disponíveis
                </Text>
                <View style={styles.list}>
                    {services.map((item) => (
                        <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.card,
                            selected === item.id && styles.selectedCard,
                        ]}
                        onPress={() => setSelected(item.id)}
                        >
                        <Image
                            source={item.icon}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                        <Text style={styles.label}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        borderRadius: 8,
        backgroundColor: "#CBCBCB",
    },
    title: {
        fontSize: 20,
        color: "#000",
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    list: {
        gap: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: 30,
        alignItems: "center",
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: "#47A138",
    },
    icon: {
        width: 55,
        height: 55,
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        color: "#000",
        fontWeight: "bold",
    },
});
