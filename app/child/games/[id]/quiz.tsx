import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

type QuizGameProps = {
    game: {
        questions: Array<{
            id: string;
            question: string;
            options: string[];
            correct: number;
        }>;
        points: number;
    };
};

export default function QuizGame({ game }: QuizGameProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);

        if (index === game.questions[currentQuestionIndex].correct) {
            setScore((prev) => prev + game.points / game.questions.length);
        }

        setTimeout(() => {
            if (currentQuestionIndex < game.questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
                setSelectedAnswer(null);
            } else {
                handleGameComplete();
            }
        }, 1000);
    };

    const handleGameComplete = () => {
        Alert.alert("Hoàn thành! 🎉", `Điểm số của bạn: ${Math.round(score)}`, [
            {
                text: "Chơi lại",
                onPress: resetGame,
                style: "cancel",
            },
            {
                text: "Quay lại",
                onPress: () => router.back(),
            },
        ]);
    };

    const resetGame = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setScore(0);
    };

    const currentQuestion = game.questions[currentQuestionIndex];

    return (
        <View className="flex-1">
            {/* Progress Bar */}
            <View className="p-4 bg-violet-50">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-violet-600 font-medium">
                        Câu hỏi {currentQuestionIndex + 1}/
                        {game.questions.length}
                    </Text>
                    <View className="flex-row items-center">
                        <MaterialIcons name="stars" size={20} color="#7C3AED" />
                        <Text className="text-violet-600 font-medium ml-1">
                            {Math.round(score)}
                        </Text>
                    </View>
                </View>
                <View className="h-2 bg-violet-100 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-violet-500 rounded-full"
                        style={{
                            width: `${
                                ((currentQuestionIndex + 1) /
                                    game.questions.length) *
                                100
                            }%`,
                        }}
                    />
                </View>
            </View>

            {/* Question */}
            <View className="p-4">
                <Text className="text-lg font-bold mb-6">
                    {currentQuestion.question}
                </Text>

                {/* Options */}
                {currentQuestion.options.map((option, index) => (
                    <Pressable
                        key={index}
                        className={`p-4 border rounded-xl mb-3 ${
                            selectedAnswer === null
                                ? "border-gray-200"
                                : selectedAnswer === index
                                ? index === currentQuestion.correct
                                    ? "bg-green-50 border-green-500"
                                    : "bg-red-50 border-red-500"
                                : index === currentQuestion.correct
                                ? "bg-green-50 border-green-500"
                                : "border-gray-200"
                        }`}
                        onPress={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                    >
                        <Text
                            className={
                                selectedAnswer === null
                                    ? "text-gray-700"
                                    : selectedAnswer === index
                                    ? index === currentQuestion.correct
                                        ? "text-green-700"
                                        : "text-red-700"
                                    : index === currentQuestion.correct
                                    ? "text-green-700"
                                    : "text-gray-700"
                            }
                        >
                            {option}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* Bottom Bar */}
            <View className="p-4 mt-auto border-t border-gray-100">
                <Pressable
                    className="bg-violet-500 p-4 rounded-xl flex-row items-center justify-center"
                    onPress={resetGame}
                >
                    <MaterialIcons name="refresh" size={24} color="white" />
                    <Text className="text-white font-bold ml-2">Chơi lại</Text>
                </Pressable>
            </View>
        </View>
    );
}
