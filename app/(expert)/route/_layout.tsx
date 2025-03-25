import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

export default function ExpertRouteLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="event/create-event" options={{ headerShown: false }}/>
        <Stack.Screen name="event/[id]" options={{ headerShown: false }}/>
        <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
        <Stack.Screen name="profile/settings" options={{ headerShown: false }} />
        <Stack.Screen name="notifications/notifications" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
