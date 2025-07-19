/******************************************************************************
*                                                                             *
* Creation Date : 16/04/2025                                                  *
*                                                                             *
* Property : (c) This program, code or item is the Intellectual Property of   *
* Evelyn Neves Barreto. Any use or copy of this code is prohibited without    *
* the express written authorization of Evelyn. All rights reserved.           *
*                                                                             *
*******************************************************************************/

import { useAuthStore } from "@/store/useAuthStore";
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

interface Props {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function LoginModal({ visible, onClose, onSuccess }: Props) {
    const { login } = useAuthStore();
    const [email, setEmail] = useState("");
    const [senha, setPassword] = useState("");
    const [erro, setError] = useState("");
    const [focusedInput, setFocusedInput] = useState<"email" | "senha" | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            setEmail("");
            setPassword("");
            setError("");
            setIsLoading(false);
        }
    }, [visible]);

    const isEmailValid = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isFormValid = () =>
        email.trim() !== "" && senha.trim() !== "" && isEmailValid(email);

    const handleSubmit = async () => {
        setError("");
        setIsLoading(true);

        try {
            await login(email, senha);
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error(err);
            switch (err.code) {
                case "auth/user-not-found":
                case "auth/wrong-password":
                    setError("Email ou senha incorretos. Revise e tente novamente.");
                    break;
                case "auth/invalid-email":
                    setError("Email inválido.");
                    break;
                default:
                    setError("Erro ao fazer login. Tente novamente.");
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
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={onClose}
                            >
                                <Text style={styles.closeText}>✕</Text>
                            </TouchableOpacity>

                            <Image
                                source={require("../../../assets/images/illustration_login.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />

                            <Text style={styles.title}>Login</Text>

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
                                secureTextEntry
                                placeholderTextColor="#8B8B8B"
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

                            <TouchableOpacity>
                                <Text style={styles.forgot}>Esqueci a senha</Text>
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
                                    <Text style={styles.buttonText}>ACESSAR</Text>
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
    forgot: {
        color: "#47A138",
        textAlign: "right",
        fontWeight: "bold",
        fontSize: 13,
        marginTop: 10,
        marginBottom: 20,
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
