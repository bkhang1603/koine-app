import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import {
    MaterialIcons,
    MaterialCommunityIcons,
    Ionicons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = ["Tất cả", "Trí tuệ", "Trí nhớ", "Phản xạ"];

// Define new games
const GAMES = [
    {
        id: "tictactoe",
        title: "Tic Tac Toe",
        description:
            "Trò chơi đánh dấu X và O cổ điển giúp phát triển tư duy chiến thuật",
        type: "trí tuệ",
        icon: "grid" as const,
        iconType: "ionicons" as const,
        color: "#8B5CF6", // Violet
        difficulty: "Dễ",
        estimatedTime: "5 phút",
        skills: ["Tư duy logic", "Chiến thuật"],
    },
    {
        id: "memory-card",
        title: "Thẻ Ghi Nhớ",
        description: "Lật thẻ và tìm các cặp giống nhau để luyện trí nhớ",
        type: "trí nhớ",
        icon: "cards-outline" as const,
        iconType: "material-community" as const,
        color: "#EC4899", // Pink
        difficulty: "Trung bình",
        estimatedTime: "10 phút",
        skills: ["Trí nhớ", "Tập trung"],
    },
    {
        id: "color-sequence",
        title: "Chuỗi Màu Sắc",
        description:
            "Ghi nhớ và lặp lại chuỗi màu sắc hiển thị với độ khó tăng dần",
        type: "phản xạ",
        icon: "palette" as const,
        iconType: "material" as const,
        color: "#3B82F6", // Blue
        difficulty: "Khó",
        estimatedTime: "7 phút",
        skills: ["Ghi nhớ", "Phản xạ"],
    },
];

type Game = {
    id: string;
    title: string;
    description: string;
    type: string;
    icon: string;
    iconType: "material" | "material-community" | "ionicons";
    color: string;
    difficulty: string;
    estimatedTime: string;
    skills: string[];
};

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

    const filteredGames = GAMES.filter(
        (game) =>
            selectedCategory === "Tất cả" ||
            game.type.toLowerCase() === selectedCategory.toLowerCase()
    );

    // Render icon based on type
    const renderIcon = (game: Game) => {
        switch (game.iconType) {
            case "material-community":
                return (
                    <MaterialCommunityIcons
                        name={game.icon as any}
                        size={32}
                        color="white"
                    />
                );
            case "ionicons":
                return (
                    <Ionicons name={game.icon as any} size={32} color="white" />
                );
            default:
                return (
                    <MaterialIcons
                        name={game.icon as any}
                        size={32}
                        color="white"
                    />
                );
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Top SafeArea với background violet */}
            <View className="bg-violet-500">
                <SafeAreaView edges={["top"]} className="bg-violet-500" />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-4 pt-4 pb-8 bg-violet-500">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-white text-xl font-bold">
                                Trò chơi
                            </Text>
                            <Text className="text-white/80 mt-1">
                                Học thông qua trò chơi
                            </Text>
                        </View>
                        <View className="flex-row">
                            <Pressable
                                className="w-10 h-10 bg-violet-400/50 rounded-full items-center justify-center"
                                onPress={() =>
                                    router.push("/child/notifications")
                                }
                            >
                                <MaterialIcons
                                    name="notifications"
                                    size={24}
                                    color="white"
                                />
                                <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                                    <Text className="text-white text-xs font-bold">
                                        3
                                    </Text>
                                </View>
                            </Pressable>
                            <Pressable
                                className="w-10 h-10 ml-2 bg-violet-400/50 rounded-full items-center justify-center"
                                onPress={() =>
                                    router.push("/child/event/event")
                                }
                            >
                                <MaterialIcons
                                    name="event-available"
                                    size={24}
                                    color="white"
                                />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Main Content with rounded top corners */}
                <View className="bg-gray-50 rounded-t-3xl -mt-4 flex-1 pt-6">
                    {/* Categories */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="pl-5"
                        contentContainerStyle={{ paddingRight: 20 }}
                    >
                        {CATEGORIES.map((category, index) => (
                            <Pressable
                                key={category}
                                className={`px-4 py-2 rounded-xl ${
                                    selectedCategory === category
                                        ? "bg-violet-500"
                                        : "bg-white border border-gray-200"
                                } ${
                                    index === CATEGORIES.length - 1
                                        ? "mr-5"
                                        : "mr-2"
                                }`}
                                onPress={() => handleCategoryPress(category)}
                            >
                                <Text
                                    className={
                                        selectedCategory === category
                                            ? "text-white font-medium"
                                            : "text-gray-700"
                                    }
                                >
                                    {category}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Games Grid */}
                    <View className="px-5 pt-6 pb-20">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-xl font-bold">
                                Trò chơi phổ biến
                            </Text>
                            <Pressable
                                onPress={() => {
                                    /* Xem tất cả */
                                }}
                            >
                                <Text className="text-violet-500 font-medium">
                                    Xem tất cả
                                </Text>
                            </Pressable>
                        </View>

                        <View className="flex-row flex-wrap -mx-2">
                            {filteredGames.map((game) => (
                                <Pressable
                                    key={game.id}
                                    className="w-1/2 p-2"
                                    onPress={() => handleGamePress(game.id)}
                                >
                                    <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                        <View className="p-4">
                                            {/* Game Icon Circle */}
                                            <View
                                                className="w-16 h-16 rounded-full mb-3 items-center justify-center"
                                                style={{
                                                    backgroundColor: game.color,
                                                }}
                                            >
                                                {renderIcon(game as Game)}
                                            </View>

                                            {/* Game Info */}
                                            <View>
                                                <View className="flex-row items-center mb-1">
                                                    <View className="bg-violet-50 px-2 py-0.5 rounded-md">
                                                        <Text className="text-violet-700 text-xs font-medium">
                                                            {game.type
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                game.type.slice(
                                                                    1
                                                                )}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <Text className="font-bold text-gray-900 text-base">
                                                    {game.title}
                                                </Text>
                                                <Text
                                                    className="text-gray-600 text-sm mt-1"
                                                    numberOfLines={2}
                                                >
                                                    {game.description}
                                                </Text>
                                            </View>

                                            {/* Game Stats */}
                                            <View className="flex-row items-center justify-between mt-3">
                                                <View className="flex-row items-center">
                                                    <MaterialIcons
                                                        name="timer"
                                                        size={16}
                                                        color="#6B7280"
                                                    />
                                                    <Text className="text-gray-600 ml-1 text-xs">
                                                        {game.estimatedTime}
                                                    </Text>
                                                </View>
                                                <View className="bg-violet-50 px-3 py-1.5 rounded-full">
                                                    <Text className="text-violet-600 text-xs font-medium">
                                                        Chơi ngay
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </View>

                        {filteredGames.length === 0 && (
                            <View className="items-center justify-center py-8">
                                <MaterialIcons
                                    name="search-off"
                                    size={64}
                                    color="#9CA3AF"
                                />
                                <Text className="text-gray-500 text-lg mt-4 text-center">
                                    Không tìm thấy trò chơi nào
                                </Text>
                                <Pressable
                                    className="mt-4 bg-violet-500 px-4 py-2 rounded-xl"
                                    onPress={() =>
                                        setSelectedCategory("Tất cả")
                                    }
                                >
                                    <Text className="text-white font-medium">
                                        Xem tất cả
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
