import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Dimensions, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

type MemoryGameProps = {
    game: {
        cards: string[];
        points: number;
    };
};

export default function MemoryGame({ game }: MemoryGameProps) {
    const [cards, setCards] = useState<string[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [isGameComplete, setIsGameComplete] = useState(false);

    useEffect(() => {
        // Duplicate cards and shuffle them
        const duplicatedCards = [...game.cards, ...game.cards];
        const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5);
        setCards(shuffledCards);
    }, []);

    const handleCardPress = (index: number) => {
        if (flippedCards.length === 2 || flippedCards.includes(index) || matchedPairs.includes(index)) {
            return;
        }

        const newFlippedCards = [...flippedCards, index];
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            setMoves(prev => prev + 1);
            const [firstIndex, secondIndex] = newFlippedCards;

            if (cards[firstIndex] === cards[secondIndex]) {
                // Match found
                setMatchedPairs(prev => [...prev, firstIndex, secondIndex]);
                setFlippedCards([]);

                // Check if game is complete
                if (matchedPairs.length + 2 === cards.length) {
                    setIsGameComplete(true);
                    handleGameComplete();
                }
            } else {
                // No match
                setTimeout(() => {
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    const handleGameComplete = () => {
        const score = Math.max(game.points - Math.floor(moves / 2) * 5, 10);
        Alert.alert(
            "Chúc mừng! 🎉",
            `Bạn đã hoàn thành trò chơi với ${moves} lượt!\nĐiểm số: ${score}`,
            [
                {
                    text: "Chơi lại",
                    onPress: resetGame,
                    style: "cancel"
                },
                {
                    text: "Quay lại",
                    onPress: () => router.back()
                }
            ]
        );
    };

    const resetGame = () => {
        const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffledCards);
        setFlippedCards([]);
        setMatchedPairs([]);
        setMoves(0);
        setIsGameComplete(false);
    };

    const WINDOW_WIDTH = Dimensions.get('window').width;
    const GRID_SIZE = Math.ceil(Math.sqrt(cards.length));
    const CARD_SIZE = (WINDOW_WIDTH - 48) / GRID_SIZE;

    return (
        <View className="flex-1">
            {/* Game Stats */}
            <View className="p-4 flex-row items-center justify-between bg-violet-50">
                <View className="flex-row items-center">
                    <MaterialIcons name="refresh" size={24} color="#7C3AED" />
                    <Text className="text-violet-600 font-medium ml-2">
                        Lượt: {moves}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <MaterialIcons name="emoji-events" size={24} color="#7C3AED" />
                    <Text className="text-violet-600 font-medium ml-2">
                        Cặp đã tìm: {matchedPairs.length / 2}/{cards.length / 2}
                    </Text>
                </View>
            </View>

            {/* Game Grid */}
            <View className="flex-1 p-4">
                <View className="flex-row flex-wrap justify-center">
                    {cards.map((card, index) => (
                        <Pressable
                            key={index}
                            onPress={() => handleCardPress(index)}
                            style={{ width: CARD_SIZE, height: CARD_SIZE }}
                            className="p-1"
                        >
                            <View
                                className={`w-full h-full rounded-xl items-center justify-center ${
                                    flippedCards.includes(index) || matchedPairs.includes(index)
                                        ? "bg-violet-500"
                                        : "bg-violet-100"
                                }`}
                            >
                                {(flippedCards.includes(index) || matchedPairs.includes(index)) && (
                                    <Text className="text-2xl">
                                        {card}
                                    </Text>
                                )}
                            </View>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Bottom Bar */}
            <View className="p-4 border-t border-gray-100">
                <Pressable
                    className="bg-violet-500 p-4 rounded-xl flex-row items-center justify-center"
                    onPress={resetGame}
                >
                    <MaterialIcons name="refresh" size={24} color="white" />
                    <Text className="text-white font-bold ml-2">
                        Chơi lại
                    </Text>
                </Pressable>
            </View>
        </View>
    );
} 