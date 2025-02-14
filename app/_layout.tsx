import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(root)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="child" options={{ headerShown: false }} />
            </Stack>
        </SafeAreaProvider>
    );
}
