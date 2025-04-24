import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

// Icons for the cards
const CARD_ICONS = [
    { name: "star", color: "#F59E0B" },
    { name: "heart", color: "#EF4444" },
    { name: "moon", color: "#3B82F6" },
    { name: "flower", color: "#EC4899" },
    { name: "music-note", color: "#10B981" },
    { name: "camera", color: "#6366F1" },
    { name: "airplane", color: "#8B5CF6" },
    { name: "cake", color: "#F97316" },
];

// Generate the full deck with pairs
const generateCards = () => {
    // Create pairs
    const pairs = [...CARD_ICONS, ...CARD_ICONS];

    // Shuffle the deck
    return pairs
        .map((card) => ({
            ...card,
            id: Math.random().toString(36).substring(2),
        }))
        .sort(() => Math.random() - 0.5);
};

const MemoryCardGame = () => {
    const [cards, setCards] = useState(generateCards());
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
    const [moves, setMoves] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);
    const [rotations] = useState(cards.map(() => new Animated.Value(0)));

    // Reset the game
    const resetGame = () => {
        setCards(generateCards());
        setFlippedIndices([]);
        setMatchedPairs([]);
        setMoves(0);
        setGameComplete(false);
        rotations.forEach((rotation) => rotation.setValue(0));
    };

    // Handle card flip
    const handleCardPress = (index: number) => {
        // If already flipped or matched, do nothing
        if (
            flippedIndices.includes(index) ||
            matchedPairs.includes(cards[index].name)
        ) {
            return;
        }

        // If already two cards flipped and checking, do nothing
        if (flippedIndices.length === 2) {
            return;
        }

        // Flip the card with animation
        Animated.timing(rotations[index], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Add to flipped indices
        const newFlippedIndices = [...flippedIndices, index];
        setFlippedIndices(newFlippedIndices);

        // If this is the second card flipped
        if (newFlippedIndices.length === 2) {
            // Increment moves
            setMoves((prevMoves) => prevMoves + 1);

            // Check for match
            const [firstIndex, secondIndex] = newFlippedIndices;
            if (cards[firstIndex].name === cards[secondIndex].name) {
                // Match found
                setMatchedPairs((prev) => [...prev, cards[firstIndex].name]);
                setFlippedIndices([]);
            } else {
                // No match, flip back after a delay
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(rotations[firstIndex], {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.timing(rotations[secondIndex], {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                    ]).start();
                    setFlippedIndices([]);
                }, 1000);
            }
        }
    };

    // Check for game completion
    useEffect(() => {
        if (matchedPairs.length === CARD_ICONS.length) {
            setGameComplete(true);
        }
    }, [matchedPairs]);

    // Render a card
    const renderCard = (card: (typeof cards)[0], index: number) => {
        const isFlipped =
            flippedIndices.includes(index) || matchedPairs.includes(card.name);

        // Card rotation animation
        const frontAnimatedStyle = {
            transform: [
                {
                    rotateY: rotations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "180deg"],
                    }),
                },
            ],
            opacity: rotations[index].interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 0, 0],
            }),
        };

        const backAnimatedStyle = {
            transform: [
                {
                    rotateY: rotations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: ["180deg", "360deg"],
                    }),
                },
            ],
            opacity: rotations[index].interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0, 1],
            }),
        };

        return (
            <Pressable
                key={card.id}
                style={styles.cardContainer}
                onPress={() => handleCardPress(index)}
                disabled={isFlipped || gameComplete}
            >
                {/* Card Back (Hidden) */}
                <Animated.View
                    style={[styles.card, styles.cardBack, frontAnimatedStyle]}
                >
                    <MaterialIcons
                        name="help-outline"
                        size={36}
                        color="#8B5CF6"
                    />
                </Animated.View>

                {/* Card Front (Revealed) */}
                <Animated.View
                    style={[
                        styles.card,
                        styles.cardFront,
                        {
                            backgroundColor: isFlipped
                                ? `${card.color}20`
                                : "#f5f3ff",
                        },
                        backAnimatedStyle,
                    ]}
                >
                    <MaterialCommunityIcons
                        name={card.name}
                        size={36}
                        color={card.color}
                    />
                </Animated.View>
            </Pressable>
        );
    };

    return (
        <View className="flex-1 items-center">
            {/* Game Information */}
            <View className="w-full px-4 mb-4">
                <View className="flex-row justify-between">
                    <View className="bg-violet-50 p-2 rounded-lg">
                        <Text className="text-violet-700 font-medium">
                            Lượt: {moves}
                        </Text>
                    </View>
                    <View className="bg-violet-50 p-2 rounded-lg">
                        <Text className="text-violet-700 font-medium">
                            Tìm thấy: {matchedPairs.length}/{CARD_ICONS.length}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Card Grid */}
            <View className="flex-row flex-wrap justify-center">
                {cards.map((card, index) => renderCard(card, index))}
            </View>

            {/* Game Complete Message */}
            {gameComplete && (
                <View className="mt-6 bg-white p-4 rounded-xl shadow-sm items-center">
                    <Text className="text-lg font-bold text-violet-600">
                        Hoàn thành trong {moves} lượt!
                    </Text>
                    <Pressable
                        className="mt-4 bg-violet-500 px-6 py-2 rounded-full"
                        onPress={resetGame}
                    >
                        <Text className="text-white font-medium">Chơi lại</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: 80,
        height: 80,
        margin: 5,
        position: "relative",
    },
    card: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        backfaceVisibility: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    cardBack: {
        backgroundColor: "#f5f3ff",
        borderWidth: 2,
        borderColor: "#e0dafc",
    },
    cardFront: {
        backgroundColor: "#f5f3ff",
    },
});

export default MemoryCardGame;
