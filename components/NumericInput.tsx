import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type NumericInputProps = {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
};

export default function NumericInput({
    value,
    onChange,
    min = 1,
    max = 99,
}: NumericInputProps) {
    const handleDecrease = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrease = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    return (
        <View className="flex-row items-center">
            <Pressable
                onPress={handleDecrease}
                className={`w-10 h-10 rounded-xl items-center justify-center ${
                    value <= min ? "bg-gray-100" : "bg-blue-50"
                }`}
                disabled={value <= min}
            >
                <MaterialIcons
                    name="remove"
                    size={24}
                    color={value <= min ? "#9CA3AF" : "#3B82F6"}
                />
            </Pressable>
            <Text className="mx-4 text-lg font-medium min-w-[40px] text-center">
                {value}
            </Text>
            <Pressable
                onPress={handleIncrease}
                className={`w-10 h-10 rounded-xl items-center justify-center ${
                    value >= max ? "bg-gray-100" : "bg-blue-50"
                }`}
                disabled={value >= max}
            >
                <MaterialIcons
                    name="add"
                    size={24}
                    color={value >= max ? "#9CA3AF" : "#3B82F6"}
                />
            </Pressable>
        </View>
    );
} 