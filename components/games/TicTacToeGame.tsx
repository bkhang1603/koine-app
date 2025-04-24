import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Player = "X" | "O" | null;
type BoardState = Player[];

const TicTacToeGame = () => {
    const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState<boolean>(true);
    const [winner, setWinner] = useState<Player | "draw" | null>(null);
    const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

    // Check for winner
    const calculateWinner = (squares: BoardState): Player | "draw" | null => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        // Check for winner
        for (const [a, b, c] of lines) {
            if (
                squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c]
            ) {
                return squares[a];
            }
        }

        // Check for draw
        if (squares.every((square) => square !== null)) {
            return "draw";
        }

        return null;
    };

    // Handle moves
    const handlePress = (index: number) => {
        if (winner || board[index]) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? "X" : "O";
        setBoard(newBoard);
        setIsXNext(!isXNext);

        const gameWinner = calculateWinner(newBoard);
        if (gameWinner) {
            setWinner(gameWinner);
            // Update scores
            if (gameWinner === "draw") {
                setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
            } else {
                setScores((prev) => ({
                    ...prev,
                    [gameWinner]: prev[gameWinner] + 1,
                }));
            }
        }
    };

    // Reset the game
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
    };

    // Computer move
    useEffect(() => {
        // If game is over or it's player's turn (X), do nothing
        if (winner || isXNext) return;

        // Simple AI: find first empty slot
        const timeout = setTimeout(() => {
            const emptyIndices = board
                .map((square, index) => (square === null ? index : -1))
                .filter((i) => i !== -1);

            if (emptyIndices.length > 0) {
                // Pick a random empty spot for the computer
                const randomIndex = Math.floor(
                    Math.random() * emptyIndices.length
                );
                const computerMove = emptyIndices[randomIndex];
                handlePress(computerMove);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [board, isXNext, winner]);

    // Render a square
    const renderSquare = (index: number) => {
        return (
            <Pressable
                key={index}
                className={`w-24 h-24 bg-white m-1 justify-center items-center rounded-lg shadow-sm ${
                    board[index] === "X"
                        ? "bg-violet-50"
                        : board[index] === "O"
                        ? "bg-pink-50"
                        : "bg-white"
                }`}
                onPress={() => handlePress(index)}
                disabled={!!winner || !!board[index] || !isXNext}
            >
                {board[index] === "X" && (
                    <MaterialCommunityIcons
                        name="close"
                        size={50}
                        color="#8B5CF6"
                    />
                )}
                {board[index] === "O" && (
                    <MaterialCommunityIcons
                        name="circle-outline"
                        size={45}
                        color="#EC4899"
                    />
                )}
            </Pressable>
        );
    };

    // Status message
    const getStatusMessage = () => {
        if (winner === "X") return "Bạn đã thắng!";
        if (winner === "O") return "Máy đã thắng!";
        if (winner === "draw") return "Hòa!";
        return isXNext ? "Lượt của bạn" : "Lượt của máy";
    };

    return (
        <View className="flex-1 items-center">
            {/* Game Board */}
            <View
                className="flex-row flex-wrap justify-center items-center mt-2"
                style={styles.board}
            >
                {Array(9)
                    .fill(null)
                    .map((_, index) => renderSquare(index))}
            </View>

            {/* Status and Controls */}
            <View className="w-full mt-4 px-4">
                <View className="bg-white p-4 rounded-xl shadow-sm items-center">
                    <Text
                        className={`text-lg font-bold ${
                            winner === "X"
                                ? "text-violet-600"
                                : winner === "O"
                                ? "text-pink-600"
                                : winner === "draw"
                                ? "text-gray-600"
                                : "text-violet-600"
                        }`}
                    >
                        {getStatusMessage()}
                    </Text>

                    {winner && (
                        <Pressable
                            className="mt-4 bg-violet-500 px-6 py-2 rounded-full"
                            onPress={resetGame}
                        >
                            <Text className="text-white font-medium">
                                Chơi lại
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>

            {/* Score Board */}
            <View className="w-full mt-4 px-4 flex-row justify-evenly">
                <View className="bg-violet-50 p-3 rounded-xl items-center flex-1 mx-1">
                    <Text className="text-violet-600 font-bold">Bạn (X)</Text>
                    <Text className="text-xl font-bold text-violet-700">
                        {scores.X}
                    </Text>
                </View>
                <View className="bg-gray-50 p-3 rounded-xl items-center flex-1 mx-1">
                    <Text className="text-gray-600 font-bold">Hòa</Text>
                    <Text className="text-xl font-bold text-gray-700">
                        {scores.draws}
                    </Text>
                </View>
                <View className="bg-pink-50 p-3 rounded-xl items-center flex-1 mx-1">
                    <Text className="text-pink-600 font-bold">Máy (O)</Text>
                    <Text className="text-xl font-bold text-pink-700">
                        {scores.O}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    board: {
        width: 300,
        height: 300,
    },
});

export default TicTacToeGame;
