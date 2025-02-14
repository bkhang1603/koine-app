import React from "react";
import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderWithBack from "@/components/HeaderWithBack";
import { useGame } from "@/contexts/GameContext";

const DIFFICULTY_OPTIONS = [
    { value: "easy", label: "Dễ", icon: "sentiment-satisfied" },
    { value: "medium", label: "Trung bình", icon: "sentiment-neutral" },
    { value: "hard", label: "Khó", icon: "sentiment-dissatisfied" },
] as const;

export default function GameSettingsScreen() {
    const { settings, updateSettings } = useGame();

    const handleDifficultyChange = (difficulty: typeof settings.difficulty) => {
        updateSettings({ difficulty });
    };

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Cài đặt trò chơi" />
            <ScrollView>
                {/* Difficulty Settings */}
                <View className="p-4">
                    <Text className="text-gray-600 font-medium mb-3">
                        Độ khó
                    </Text>
                    <View className="bg-violet-50 rounded-xl overflow-hidden">
                        {DIFFICULTY_OPTIONS.map((option, index) => (
                            <Pressable
                                key={option.value}
                                className={`flex-row items-center p-4 ${
                                    index !== DIFFICULTY_OPTIONS.length - 1
                                        ? "border-b border-violet-100"
                                        : ""
                                }`}
                                onPress={() =>
                                    handleDifficultyChange(option.value)
                                }
                            >
                                <MaterialIcons
                                    name={option.icon}
                                    size={24}
                                    color={
                                        settings.difficulty === option.value
                                            ? "#7C3AED"
                                            : "#9CA3AF"
                                    }
                                />
                                <Text
                                    className={`flex-1 ml-3 ${
                                        settings.difficulty === option.value
                                            ? "text-violet-600 font-medium"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {option.label}
                                </Text>
                                {settings.difficulty === option.value && (
                                    <MaterialIcons
                                        name="check"
                                        size={24}
                                        color="#7C3AED"
                                    />
                                )}
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Only Vibration Settings */}
                <View className="p-4">
                    <Text className="text-gray-600 font-medium mb-3">
                        Cài đặt khác
                    </Text>
                    <View className="bg-violet-50 rounded-xl">
                        <View className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center">
                                <MaterialIcons
                                    name="vibration"
                                    size={24}
                                    color="#7C3AED"
                                />
                                <Text className="ml-3">Rung</Text>
                            </View>
                            <Switch
                                value={settings.vibrationEnabled}
                                onValueChange={(vibrationEnabled) =>
                                    updateSettings({ vibrationEnabled })
                                }
                                trackColor={{
                                    false: "#E5E7EB",
                                    true: "#DDD6FE",
                                }}
                                thumbColor={
                                    settings.vibrationEnabled
                                        ? "#7C3AED"
                                        : "#9CA3AF"
                                }
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
