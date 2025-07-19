/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
    Image,
    ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function SignupModal({ visible, onClose, onSuccess }: Props) {
    const { signUp } = useAuthStore();
    const [nome, setName] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setPassword] = useState("");
    const [aceito, setAccepted] = useState(false);
    const [focusedInput, setFocusedInput] = useState<"nome" | "email" | "senha" | null>(null);
    const [erro, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            setName("");
            setEmail("");
            setPassword("");
            setAccepted(false);
            setError("");
            setIsLoading(false);
        }
    }, [visible]);

    const isEmailValid = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isFormValid = () =>
        nome.trim() !== "" &&
        isEmailValid(email) &&
        aceito;

    const handleSubmit = async () => {
        setError("");
        setIsLoading(true);
        try {
            await signUp(email, senha, nome);
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error(err);
            switch (err.code) {
                case "auth/email-already-in-use":
                    setError("Este email já está cadastrado.");
                    break;
                case "auth/invalid-email":
                    setError("Email inválido.");
                    break;
                case "auth/weak-password":
                    setError("A senha deve ter pelo menos 6 caracteres.");
                    break;
                default:
                    setError("Erro ao criar conta. Tente novamente.");
                    break;
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeText}>✕</Text>
                            </TouchableOpacity>

                            <Image
                                source={require("../../../assets/images/illustration_registration.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />

                            <Text style={styles.title}>
                                Preencha os campos abaixo para criar sua conta corrente!
                            </Text>

                            <TextInput
                                placeholder="Digite seu nome completo *"
                                placeholderTextColor="#8B8B8B"
                                style={[
                                    styles.input,
                                    focusedInput === "nome" && styles.inputFocused,
                                ]}
                                value={nome}
                                onChangeText={setName}
                                onFocus={() => setFocusedInput("nome")}
                                onBlur={() => setFocusedInput(null)}
                                maxLength={50}
                            />

                            <TextInput
                                placeholder="Digite seu email *"
                                placeholderTextColor="#8B8B8B"
                                style={[
                                    styles.input,
                                    focusedInput === "email" && styles.inputFocused,
                                    !!email && !isEmailValid(email) && styles.inputError,
                                ]}
                                value={email}
                                onChangeText={setEmail}
                                onFocus={() => setFocusedInput("email")}
                                onBlur={() => setFocusedInput(null)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            {!!email && !isEmailValid(email) && (
                                <Text style={styles.errorText}>
                                    Email inválido. Revise e tente novamente.
                                </Text>
                            )}

                            <TextInput
                                placeholder="Digite sua senha *"
                                placeholderTextColor="#8B8B8B"
                                secureTextEntry
                                style={[
                                    styles.input,
                                    focusedInput === "senha" && styles.inputFocused,
                                ]}
                                value={senha}
                                onChangeText={setPassword}
                                onFocus={() => setFocusedInput("senha")}
                                onBlur={() => setFocusedInput(null)}
                            />

                            {!!erro && <Text style={styles.errorText}>{erro}</Text>}

                            <TouchableOpacity
                                onPress={() => setAccepted(!aceito)}
                                style={styles.checkboxContainer}
                            >
                                <MaterialCommunityIcons
                                    name={aceito ? "checkbox-marked" : "checkbox-blank-outline"}
                                    size={20}
                                    color="#47A138"
                                />
                                <Text style={styles.checkboxLabel}>
                                    Li e estou ciente quanto às condições de tratamento dos meus dados. *
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    (!isFormValid() || isLoading) && styles.buttonDisabled,
                                ]}
                                onPress={handleSubmit}
                                disabled={!isFormValid() || isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>CRIAR CONTA</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#F8F8F8",
        borderRadius: 8,
        padding: 24,
        elevation: 6,
    },
    closeButton: { alignSelf: "flex-end" },
    closeText: { fontSize: 15 },
    image: {
        height: 100,
        alignSelf: "center",
    },
    title: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold",
        color: "#000",
    },
    input: {
        borderWidth: 1,
        color: "#000",
        borderColor: "#DEE9EA",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: 30,
        fontSize: 14,
    },
    inputFocused: {
        borderColor: "#003c4f",
    },
    inputError: {
        borderColor: "#BF1313",
    },
    errorText: {
        color: "#BF1313",
        fontSize: 12,
        fontWeight: "500",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 20,
        marginTop: 30,
    },
    checkboxLabel: {
        flex: 1,
        fontSize: 12,
        color: "#000",
        marginLeft: 8,
    },
    button: {
        backgroundColor: "#FF5031",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
