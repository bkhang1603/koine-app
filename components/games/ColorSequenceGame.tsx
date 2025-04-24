import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Color options for the sequence
const COLORS = [
    { key: "red", value: "#EF4444", name: "Đỏ" },
    { key: "yellow", value: "#F59E0B", name: "Vàng" },
    { key: "green", value: "#10B981", name: "Xanh lá" },
    { key: "blue", value: "#3B82F6", name: "Xanh dương" },
];

// Game states
type GameState = "waiting" | "watching" | "repeating" | "gameOver";

const ColorSequenceGame = () => {
    // Game state
    const [sequence, setSequence] = useState<string[]>([]);
    const [playerSequence, setPlayerSequence] = useState<string[]>([]);
    const [gameState, setGameState] = useState<GameState>("waiting");
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // Animation refs
    const buttonScales = useRef(COLORS.map(() => new Animated.Value(1)));
    const statusOpacity = useRef(new Animated.Value(1));

    // Start a new game
    const startGame = () => {
        setSequence([]);
        setPlayerSequence([]);
        setGameState("watching");
        setLevel(1);
        setScore(0);
        addToSequence();
    };

    // Add a color to the sequence
    const addToSequence = () => {
        // Pick a random color
        const randomIndex = Math.floor(Math.random() * COLORS.length);
        const randomColor = COLORS[randomIndex].key;

        // Add to the sequence
        setSequence((prevSequence) => [...prevSequence, randomColor]);
    };

    // Play the sequence for the player to watch
    useEffect(() => {
        if (gameState !== "watching" || sequence.length === 0) return;

        // Animate the status text
        Animated.sequence([
            Animated.timing(statusOpacity.current, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(statusOpacity.current, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Play the sequence after a delay
        const playSequenceTimeout = setTimeout(() => {
            playSequence();
        }, 1000);

        return () => clearTimeout(playSequenceTimeout);
    }, [gameState, sequence]);

    // Play the current sequence animation
    const playSequence = () => {
        // Play each color in sequence with delay
        sequence.forEach((color, index) => {
            const colorIndex = COLORS.findIndex((c) => c.key === color);

            // Highlight each color in sequence with delay
            setTimeout(() => {
                highlightButton(colorIndex);
            }, index * 800);
        });

        // After showing the sequence, let player repeat
        setTimeout(() => {
            setGameState("repeating");
            setPlayerSequence([]);
        }, sequence.length * 800 + 500);
    };

    // Animate button press
    const highlightButton = (index: number) => {
        Animated.sequence([
            Animated.timing(buttonScales.current[index], {
                toValue: 1.2,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScales.current[index], {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Handle player's color press
    const handleColorPress = (colorKey: string) => {
        if (gameState !== "repeating") return;

        // Highlight the pressed button
        const colorIndex = COLORS.findIndex((c) => c.key === colorKey);
        highlightButton(colorIndex);

        // Add to player sequence
        const newPlayerSequence = [...playerSequence, colorKey];
        setPlayerSequence(newPlayerSequence);

        // Check if this input matches the corresponding position in the sequence
        const currentIndex = playerSequence.length;
        if (colorKey !== sequence[currentIndex]) {
            // Wrong color - game over
            setGameState("gameOver");
            // Update high score
            if (score > highScore) {
                setHighScore(score);
            }
            return;
        }

        // Check if player completed the sequence
        if (newPlayerSequence.length === sequence.length) {
            // Sequence complete!
            const newScore = score + level * 10;
            setScore(newScore);
            setLevel((prevLevel) => prevLevel + 1);
            setPlayerSequence([]);
            setGameState("watching");

            // Add a new color to the sequence
            setTimeout(() => {
                addToSequence();
            }, 1000);
        }
    };

    // Render game status message
    const renderStatusMessage = () => {
        switch (gameState) {
            case "waiting":
                return 'Nhấn "Bắt đầu" để chơi!';
            case "watching":
                return "Quan sát chuỗi màu sắc...";
            case "repeating":
                return "Lặp lại chuỗi màu sắc!";
            case "gameOver":
                return "Game Over!";
        }
    };

    // Render color buttons
    const renderColorButtons = () => {
        return (
            <View className="flex-row flex-wrap justify-center">
                {COLORS.map((color, index) => (
                    <Animated.View
                        key={color.key}
                        style={[
                            {
                                transform: [
                                    { scale: buttonScales.current[index] },
                                ],
                            },
                        ]}
                    >
                        <Pressable
                            style={[
                                styles.colorButton,
                                { backgroundColor: color.value },
                            ]}
                            onPress={() => handleColorPress(color.key)}
                            disabled={gameState !== "repeating"}
                            className="mx-2 my-2"
                        >
                            <Text className="text-white font-bold">
                                {color.name}
                            </Text>
                        </Pressable>
                    </Animated.View>
                ))}
            </View>
        );
    };

    return (
        <View className="flex-1 items-center justify-center">
            {/* Game Info */}
            <View className="w-full px-4 mb-6">
                <View className="flex-row justify-between">
                    <View className="bg-violet-50 p-2 rounded-lg">
                        <Text className="text-violet-700 font-medium">
                            Cấp: {level}
                        </Text>
                    </View>
                    <View className="bg-violet-50 p-2 rounded-lg">
                        <Text className="text-violet-700 font-medium">
                            Điểm: {score}
                        </Text>
                    </View>
                    <View className="bg-violet-50 p-2 rounded-lg">
                        <Text className="text-violet-700 font-medium">
                            Kỷ lục: {highScore}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Status */}
            <Animated.View
                className="bg-white py-4 px-6 rounded-xl shadow-sm mb-8 w-64 items-center"
                style={{ opacity: statusOpacity.current }}
            >
                <Text className="text-lg font-medium text-violet-700">
                    {renderStatusMessage()}
                </Text>
                {gameState === "repeating" && (
                    <Text className="text-gray-500 mt-2">
                        {playerSequence.length}/{sequence.length}
                    </Text>
                )}
            </Animated.View>

            {/* Color Buttons */}
            {renderColorButtons()}

            {/* Start/Restart Button */}
            {(gameState === "waiting" || gameState === "gameOver") && (
                <Pressable
                    className="mt-8 bg-violet-500 py-3 px-6 rounded-full flex-row items-center"
                    onPress={startGame}
                >
                    <MaterialIcons name="refresh" size={20} color="white" />
                    <Text className="text-white font-bold ml-2">
                        {gameState === "waiting" ? "Bắt đầu" : "Chơi lại"}
                    </Text>
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    colorButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
});

export default ColorSequenceGame;
