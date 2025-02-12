import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MOCK_ACHIEVEMENTS } from "@/constants/mock-data";
import HeaderWithBack from "@/components/child/HeaderWithBack";

export default function AchievementsScreen() {
    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Thành tích" />
            
            <ScrollView>
                {/* Stats Overview */}
                <View className="flex-row p-4">
                    <View className="flex-1 bg-violet-50 rounded-xl p-4 mr-2">
                        <MaterialIcons name="emoji-events" size={24} color="#7C3AED" />
                        <Text className="text-2xl font-bold mt-2">
                            {MOCK_ACHIEVEMENTS.length}
                        </Text>
                        <Text className="text-gray-600">Thành tích</Text>
                    </View>
                    <View className="flex-1 bg-violet-50 rounded-xl p-4 ml-2">
                        <MaterialIcons name="stars" size={24} color="#7C3AED" />
                        <Text className="text-2xl font-bold mt-2">
                            {MOCK_ACHIEVEMENTS.reduce((sum, a) => sum + a.reward, 0)}
                        </Text>
                        <Text className="text-gray-600">Tổng điểm</Text>
                    </View>
                </View>

                {/* Achievements List */}
                <View className="p-4">
                    {MOCK_ACHIEVEMENTS.map((achievement) => (
                        <View 
                            key={achievement.id}
                            className="bg-white rounded-xl border border-gray-100 p-4 mb-4"
                        >
                            <View className="flex-row items-start">
                                <View className={`w-12 h-12 rounded-xl items-center justify-center bg-violet-100`}>
                                    <MaterialIcons
                                        name={achievement.icon as any}
                                        size={24}
                                        color="#7C3AED"
                                    />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="font-bold text-base">
                                        {achievement.title}
                                    </Text>
                                    <Text className="text-gray-600 mt-1">
                                        {achievement.description}
                                    </Text>
                                </View>
                                <View className="items-end">
                                    <View className="flex-row items-center">
                                        <MaterialIcons name="stars" size={16} color="#7C3AED" />
                                        <Text className="text-violet-600 font-bold ml-1">
                                            +{achievement.reward}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Progress Bar */}
                            <View className="mt-4">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-600">Tiến độ</Text>
                                    <Text className="font-medium">
                                        {achievement.progress}/{achievement.total}
                                    </Text>
                                </View>
                                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <View
                                        className="h-full bg-violet-500 rounded-full"
                                        style={{
                                            width: `${(achievement.progress / achievement.total) * 100}%`,
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
} 