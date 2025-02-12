import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Image,
    Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeaderWithBack from "@/components/HeaderWithBack";
import { MOCK_COURSES } from "@/constants/mock-data";

const TRENDING_KEYWORDS = [
    "Dậy thì",
    "Kỹ năng giao tiếp",
    "Tâm lý tuổi teen",
    "Quản lý cảm xúc",
    "Dinh dưỡng",
    "Sức khỏe sinh sản",
    "Giới tính",
    "Tình bạn",
];

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(MOCK_COURSES);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.trim()) {
            const filtered = MOCK_COURSES.filter((course) =>
                course.title.toLowerCase().includes(text.toLowerCase())
            );
            setSearchResults(filtered);
        } else {
            setSearchResults(MOCK_COURSES);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title="Tìm kiếm" showMoreOptions={false} />

            <View className="p-4">
                <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
                    <MaterialIcons name="search" size={24} color="#6B7280" />
                    <TextInput
                        className="flex-1 py-3 px-2"
                        placeholder="Tìm kiếm khóa học..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                        autoFocus
                    />
                    {searchQuery ? (
                        <Pressable
                            onPress={() => handleSearch("")}
                            hitSlop={8}
                        >
                            <MaterialIcons
                                name="close"
                                size={24}
                                color="#6B7280"
                            />
                        </Pressable>
                    ) : null}
                </View>
            </View>

            <ScrollView>
                {!searchQuery && (
                    <View className="px-4 mb-6">
                        <Text className="font-bold text-lg mb-3">
                            Xu hướng tìm kiếm
                        </Text>
                        <View className="flex-row flex-wrap">
                            {TRENDING_KEYWORDS.map((keyword) => (
                                <Pressable
                                    key={keyword}
                                    className="bg-gray-100 rounded-full px-4 py-2 mr-2 mb-2"
                                    onPress={() => handleSearch(keyword)}
                                >
                                    <Text className="text-gray-700">
                                        {keyword}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                {searchQuery && (
                    <View className="px-4">
                        <Text className="text-gray-600 mb-4">
                            {searchResults.length} kết quả cho "{searchQuery}"
                        </Text>
                        {searchResults.map((course) => (
                            <Pressable
                                key={course.id}
                                className="flex-row items-center p-3 border-b border-gray-100"
                                onPress={() =>
                                    router.push({
                                        pathname: "/courses/[id]",
                                        params: { id: course.id },
                                    })
                                }
                            >
                                <MaterialIcons
                                    name="menu-book"
                                    size={24}
                                    color="#6B7280"
                                />
                                <View className="ml-3 flex-1">
                                    <Text className="font-medium">
                                        {course.title}
                                    </Text>
                                    <Text className="text-gray-500 text-sm">
                                        {course.category} • {course.level}
                                    </Text>
                                </View>
                                <MaterialIcons
                                    name="chevron-right"
                                    size={24}
                                    color="#9CA3AF"
                                />
                            </Pressable>
                        ))}
                    </View>
                )}

                {searchQuery && searchResults.length === 0 && (
                    <View className="p-4 items-center">
                        <MaterialIcons
                            name="search-off"
                            size={48}
                            color="#9CA3AF"
                        />
                        <Text className="text-gray-500 mt-2 text-center">
                            Không tìm thấy kết quả nào cho "{searchQuery}"
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
