import React from "react";
import { View, Text, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_GAMES } from "@/constants/mock-data";
import { useGame } from "@/contexts/GameContext";

export default function LeaderboardScreen() {
    const { highScores } = useGame();

    const getGameInfo = (gameId: string) => {
        return MOCK_GAMES.find((g) => g.id === gameId);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
        });
    };

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Bảng xếp hạng" returnTab="/child/(tabs)/games" showMoreOptions={false}/>
            <ScrollView>
                {/* Top Scores */}
                <View className="p-4">
                    {highScores.map((score, index) => {
                        const game = getGameInfo(score.gameId);
                        if (!game) return null;

                        return (
                            <View
                                key={`${score.gameId}-${score.date}`}
                                className="flex-row items-center bg-violet-50 rounded-xl p-4 mb-3"
                            >
                                <View
                                    className={`w-10 h-10 rounded-full items-center justify-center ${
                                        index < 3
                                            ? "bg-yellow-400"
                                            : "bg-violet-200"
                                    }`}
                                >
                                    <Text className="text-lg font-bold text-white">
                                        {index + 1}
                                    </Text>
                                </View>
                                <View className="flex-1 ml-4">
                                    <Text className="font-bold">
                                        {game.title}
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        {formatDate(score.date)}
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <MaterialIcons
                                        name="stars"
                                        size={20}
                                        color="#7C3AED"
                                    />
                                    <Text className="text-violet-600 font-bold ml-1">
                                        {score.score}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}

                    {highScores.length === 0 && (
                        <View className="items-center py-8">
                            <MaterialIcons
                                name="emoji-events"
                                size={48}
                                color="#D1D5DB"
                            />
                            <Text className="text-gray-400 mt-4">
                                Chưa có điểm số nào
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
