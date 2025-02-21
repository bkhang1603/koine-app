import { ActivityIndicator, View, Text } from "react-native";

const ActivityIndicatorScreen = () => (
  <View className="flex-1 justify-center items-center">
    <ActivityIndicator size="large" color="#0000ff" />
    <Text>Loading...</Text>
  </View>
);

export default ActivityIndicatorScreen