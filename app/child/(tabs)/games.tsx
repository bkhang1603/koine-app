import React from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MOCK_GAMES } from "@/constants/mock-data";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = ["Tất cả", "Quiz", "Memory", "Puzzle"];

export default function GamesScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState("Tất cả");

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  }; 

  const handleGamePress = (gameId: string) => {
    router.push({
      pathname: "/child/games/[id]",
      params: { id: gameId },
    });
  };

  const filteredGames = MOCK_GAMES.filter(
    (game) =>
      selectedCategory === "Tất cả" ||
      game.type === selectedCategory.toLowerCase()
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <SafeAreaView>
        {/* Header with Settings & Leaderboard */}
        <View className="p-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold">Trò chơi</Text>
            <Text className="text-gray-600 mt-1">Học thông qua trò chơi</Text>
          </View>
          <View className="flex-row">
            <Pressable
              className="w-10 h-10 rounded-full bg-violet-100 items-center justify-center mr-2"
              onPress={() => router.push("/child/games/leaderboard")}
            >
              <MaterialIcons name="emoji-events" size={24} color="#7C3AED" />
            </Pressable>
            <Pressable
              className="w-10 h-10 rounded-full bg-violet-100 items-center justify-center"
              onPress={() => router.push("/child/games/settings")}
            >
              <MaterialIcons name="settings" size={24} color="#7C3AED" />
            </Pressable>
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4"
        >
          {CATEGORIES.map((category) => (
            <Pressable
              key={category}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category ? "bg-violet-500" : "bg-violet-50"
              }`}
              onPress={() => handleCategoryPress(category)}
            >
              <Text
                className={
                  selectedCategory === category
                    ? "text-white font-medium"
                    : "text-violet-600"
                }
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Games Grid */}
        <View className="p-4 flex-row flex-wrap">
          {filteredGames.map((game) => (
            <Pressable
              key={game.id}
              className="w-1/2 p-2"
              onPress={() => handleGamePress(game.id)}
            >
              <View className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <Image
                  source={{ uri: game.thumbnail }}
                  className="w-full h-32"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="font-bold">{game.title}</Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    {game.description}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
        <View className="h-20"></View>
      </SafeAreaView>
    </ScrollView>
  );
}
