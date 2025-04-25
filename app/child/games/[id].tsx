import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TicTacToeGame from "../../../components/games/TicTacToeGame";
import MemoryCardGame from "../../../components/games/MemoryCardGame";
import ColorSequenceGame from "../../../components/games/ColorSequenceGame";

// Game components will be imported based on the ID

export default function GameDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [gameInfo, setGameInfo] = useState<{
        title: string;
        description: string;
        instructions: string;
        color: string;
    } | null>(null);

    useEffect(() => {
        setLoading(true);
        // Get game info based on ID
        switch (id) {
            case "tictactoe":
                setGameInfo({
                    title: "Tic Tac Toe",
                    description:
                        "Trò chơi đánh dấu X và O cổ điển giúp phát triển tư duy chiến thuật",
                    instructions:
                        "Hãy đánh dấu X hoặc O để tạo thành một hàng ngang, dọc hoặc chéo trước đối thủ.",
                    color: "#8B5CF6", // Violet
                });
                break;
            case "memory-card":
                setGameInfo({
                    title: "Thẻ Ghi Nhớ",
                    description:
                        "Lật thẻ và tìm các cặp giống nhau để luyện trí nhớ",
                    instructions:
                        "Nhấn vào các thẻ để lật lên. Tìm các cặp thẻ giống nhau để ghi điểm. Hoàn thành tất cả các cặp để thắng.",
                    color: "#EC4899", // Pink
                });
                break;
            case "color-sequence":
                setGameInfo({
                    title: "Chuỗi Màu Sắc",
                    description:
                        "Ghi nhớ và lặp lại chuỗi màu sắc hiển thị với độ khó tăng dần",
                    instructions:
                        "Quan sát chuỗi màu sắc sẽ hiển thị. Sau đó nhập lại theo đúng thứ tự để vượt qua các cấp độ.",
                    color: "#3B82F6", // Blue
                });
                break;
            default:
                // Game not found, go back
                router.back();
                return;
        }

        // Simulate loading game
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [id]);

    if (!gameInfo) {
        return null;
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Top SafeArea */}
            <View style={{ backgroundColor: gameInfo.color }}>
                <SafeAreaView
                    edges={["top"]}
                    style={{ backgroundColor: gameInfo.color }}
                />
            </View>

            {/* Header */}
            <View
                className="px-4 pt-4 pb-8"
                style={{ backgroundColor: gameInfo.color }}
            >
                <View className="flex-row items-center justify-between">
                    <Pressable
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                        onPress={() => router.back()}
                    >
                        <MaterialIcons
                            name="arrow-back"
                            size={24}
                            color="white"
                        />
                    </Pressable>

                    <Text className="text-white text-center text-xl font-bold">
                        {gameInfo.title}
                    </Text>

                    {/* <Pressable
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                        onPress={() => router.push("/child/games/settings")}
                    >
                        <MaterialIcons
                            name="settings"
                            size={24}
                            color="white"
                        />
                    </Pressable> */}
                </View>
            </View>

            {/* Main Content with rounded top corners */}
            <View className="bg-gray-50 rounded-t-3xl -mt-4 flex-1">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator
                            size="large"
                            color={gameInfo.color}
                        />
                        <Text className="mt-4 text-gray-600">
                            Đang tải trò chơi...
                        </Text>
                    </View>
                ) : (
                    <View className="flex-1">
                        {/* Game Instructions */}
                        <View className="px-5 pt-6 mb-4">
                            <Text className="text-lg font-bold mb-2">
                                Hướng dẫn
                            </Text>
                            <View className="bg-white p-4 rounded-xl border border-gray-100">
                                <Text className="text-gray-700 leading-5">
                                    {gameInfo.instructions}
                                </Text>
                            </View>
                        </View>

                        {/* Game Component */}
                        <View className="flex-1 px-5">
                            {id === "tictactoe" && <TicTacToeGame />}
                            {id === "memory-card" && <MemoryCardGame />}
                            {id === "color-sequence" && <ColorSequenceGame />}
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}
