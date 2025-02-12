import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

type CourseCardProps = {
    course: {
        id: string;
        title: string;
        description: string;
        thumbnail: string;
        instructor: string;
        rating: number;
        students: number;
        price: number;
        topics: string[];
    };
};

export default function CourseCard({ course }: CourseCardProps) {
    return (
        <Link href={`/courses/${course.id}`} asChild>
            <Pressable className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
                <Image
                    source={{ uri: course.thumbnail }}
                    className="w-full h-48"
                    resizeMode="cover"
                />
                <View className="p-4">
                    <Text className="text-lg font-bold" numberOfLines={2}>
                        {course.title}
                    </Text>
                    <Text className="text-gray-600 mt-1" numberOfLines={2}>
                        {course.description}
                    </Text>
                    <View className="flex-row items-center mt-2">
                        <MaterialIcons name="person" size={16} color="#6B7280" />
                        <Text className="text-gray-600 ml-1">
                            {course.instructor}
                        </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-3">
                        <View className="flex-row items-center">
                            <MaterialIcons name="star" size={16} color="#FCD34D" />
                            <Text className="ml-1 font-medium">{course.rating}</Text>
                            <Text className="text-gray-600 ml-2">
                                ({course.students.toLocaleString()} học viên)
                            </Text>
                        </View>
                        <Text className="text-blue-500 font-bold">
                            {course.price.toLocaleString("vi-VN")} ₫
                        </Text>
                    </View>
                </View>
            </Pressable>
        </Link>
    );
} 