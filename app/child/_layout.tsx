import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

export default function ChildLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="achievements" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="profile/edit" />
        <Stack.Screen name="search/searchCourse" />
        <Stack.Screen name="courses/[id]" />
        <Stack.Screen name="courses/lesson/[lessonId]" />
        <Stack.Screen name="games/[id]" />
        <Stack.Screen name="games/leaderboard" />
        <Stack.Screen name="games/settings" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="learn/course/[courseId]" />
        <Stack.Screen name="learn/chapter/[chapterId]" />
        <Stack.Screen name="learn/lesson/[lessonId]" />
        <Stack.Screen name="learn/question/[chapterId]" />
        <Stack.Screen name="event/[id]" />
        <Stack.Screen name="event/event" />
      </Stack>
    </View>
  );
}
