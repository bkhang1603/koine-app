import { Stack } from "expo-router";
import { Slot } from "expo-router";
export default function AuthLayout() {
  return <Slot />;

  // return (
  //     <Stack screenOptions={{ headerShown: false }}>
  //         <Stack.Screen name="login" />
  //         <Stack.Screen name="register" />
  //         <Stack.Screen name="OTPConfirmation" />
  //         <Stack.Screen name="forgotPassword" />
  //     </Stack>
  // );
}
