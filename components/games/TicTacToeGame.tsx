import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Player = "X" | "O" | null;
type BoardState = Player[];

const TicTacToeGame = () => {
    const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState<boolean>(true);
    const [winner, setWinner] = useState<Player | "draw" | null>(null);
    const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
    const [boardSize, setBoardSize] = useState(
        Math.min(300, Dimensions.get("window").width - 40)
    );
    const [squareSize, setSquareSize] = useState(
        Math.floor((boardSize - 12) / 3)
    ); // -12 for margins

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

    // Update board size when window dimensions change
    useEffect(() => {
        const updateLayout = () => {
            const width = Dimensions.get("window").width;
            const newBoardSize = Math.min(300, width - 40);
            setBoardSize(newBoardSize);
            setSquareSize(Math.floor((newBoardSize - 12) / 3)); // Account for margins between squares
        };

        // Set initial size
        updateLayout();

        // Listen for dimension changes
        const subscription = Dimensions.addEventListener(
            "change",
            updateLayout
        );

        // Cleanup
        return () => subscription.remove();
    }, []);

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
        const iconSize = Math.floor(squareSize * 0.7);

        return (
            <Pressable
                key={index}
                style={{
                    width: squareSize,
                    height: squareSize,
                    margin: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                    backgroundColor:
                        board[index] === "X"
                            ? "#F5F3FF" // bg-violet-50
                            : board[index] === "O"
                            ? "#FDF2F8" // bg-pink-50
                            : "white",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 1,
                    elevation: 1,
                }}
                onPress={() => handlePress(index)}
                disabled={!!winner || !!board[index] || !isXNext}
            >
                {board[index] === "X" && (
                    <MaterialCommunityIcons
                        name="close"
                        size={iconSize}
                        color="#8B5CF6"
                    />
                )}
                {board[index] === "O" && (
                    <MaterialCommunityIcons
                        name="circle-outline"
                        size={iconSize - 5}
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

    // Build the grid in 3 rows of 3 squares
    const renderBoard = () => {
        const rows = [];
        for (let row = 0; row < 3; row++) {
            const columns = [];
            for (let col = 0; col < 3; col++) {
                const index = row * 3 + col;
                columns.push(renderSquare(index));
            }
            rows.push(
                <View key={row} style={{ flexDirection: "row" }}>
                    {columns}
                </View>
            );
        }
        return rows;
    };

    return (
        <View className="flex-1 items-center">
            {/* Game Board */}
            <View
                style={{
                    width: boardSize,
                    height: boardSize,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 8,
                }}
            >
                {renderBoard()}
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

export default TicTacToeGame;
