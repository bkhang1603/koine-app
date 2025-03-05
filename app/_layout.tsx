import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppProvider from "@/components/app-provider";
import AuthProvider from "@/components/auth-provider";
import { Provider } from "react-native-paper";
import { SocketProvider } from "@/util/SocketProvider";

export default function RootLayout() {
  return (
    <Provider>
      <SafeAreaProvider>
        <AppProvider>
          <AuthProvider>
            <SocketProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(root)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="child" options={{ headerShown: false }} />
              </Stack>
            </SocketProvider>
          </AuthProvider>
        </AppProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
