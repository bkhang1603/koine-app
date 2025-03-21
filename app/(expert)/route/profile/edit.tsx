import HeaderWithBack from "@/components/HeaderWithBack";
import { Text, View } from "react-native";

export default function EditProfileScreen() {
  return (
    <View className="flex-1 bg-white">
      <HeaderWithBack
        title="CreateEventScreen"
        showMoreOptions={false}
        returnTab="/(expert)/(tabs)/profile"
      />
      <Text> EditProfileScreen của expert</Text>
    </View>
  );
}
