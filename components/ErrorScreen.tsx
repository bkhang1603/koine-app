import { View, Text } from "react-native";
const ErrorScreen = ({ message }: { message: string }) => (
  <View className="flex-1 justify-center items-center">
    <Text className="text-red-500 text-lg">{message}</Text>
  </View>
);

export default ErrorScreen