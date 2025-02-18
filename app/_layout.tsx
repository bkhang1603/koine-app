import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppProvider from "@/components/app-provider";
import AuthProvider from "@/components/auth-provider";
import { Provider } from "react-native-paper";

export default function RootLayout() {
  return (
    <Provider>
      <SafeAreaProvider>
        <AppProvider>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(root)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="child" options={{ headerShown: false }} />
            </Stack>
          </AuthProvider>
        </AppProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
