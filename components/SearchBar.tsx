import React from "react";
import { View, TextInput, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type SearchBarProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
};

export default function SearchBar({ value, onChangeText, placeholder = "Tìm kiếm..." }: SearchBarProps) {
    return (
        <View className="px-4 py-2">
            <View className="flex-row items-center bg-gray-100 rounded-full px-4 h-12">
                <MaterialIcons name="search" size={24} color="#6B7280" />
                <TextInput
                    className="flex-1 ml-2 text-base"
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor="#6B7280"
                />
                {value ? (
                    <Pressable
                        onPress={() => onChangeText("")}
                        className="p-2"
                    >
                        <MaterialIcons name="close" size={20} color="#6B7280" />
                    </Pressable>
                ) : null}
            </View>
        </View>
    );
} 