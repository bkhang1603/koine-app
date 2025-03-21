import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-white justify-center">
      <Text> ProfileScreen của expert</Text>
      <Pressable
        className="border-2 border-black"
        onPress={() => {
          router.push("/(expert)/route/profile/edit");
        }}
      >
        <Text>click to edit profile</Text>
      </Pressable>
    </View>
  );
}
