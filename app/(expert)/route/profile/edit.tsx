import HeaderWithBack from "@/components/HeaderWithBack";
import { Text, View } from "react-native";

export default function EditProfileScreen() {
  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="EditEventScreen"
        showMoreOptions={false}
        returnTab="/(expert)/menu/profile"
      />
      <Text> EditProfileScreen của expert</Text>
    </View>
  );
}
