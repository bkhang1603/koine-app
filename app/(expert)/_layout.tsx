import { Stack } from "expo-router";
import { View } from "react-native";

export default function ExpertLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="route" />
      </Stack>
    </View>
  );
}
