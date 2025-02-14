import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import { AuthProvider } from "../components/auth";
import GameProvider from "@/app/lib/contexts/GameContext";
import AppProvider from "@/components/app-provider";
import AuthProvider from "@/components/auth-provider";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AuthProvider>
          <GameProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="auth" />
              <Stack.Screen name="(root)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="child" options={{ headerShown: false }} />
              <Stack.Screen name="adult" options={{ headerShown: false }} />
            </Stack>
          </GameProvider>
        </AuthProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
