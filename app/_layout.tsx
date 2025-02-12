import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../components/auth";
import GameProvider from "@/app/lib/contexts/GameContext";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <GameProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="(root)" />
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="child" options={{ headerShown: false }} />
                    </Stack>
                </GameProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
