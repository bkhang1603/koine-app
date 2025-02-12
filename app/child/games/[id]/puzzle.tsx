import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Image, Dimensions, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

type PuzzleGameProps = {
    game: {
        image: string;
        pieces: number;
        points: number;
    };
};

export default function PuzzleGame({ game }: PuzzleGameProps) {
    const WINDOW_WIDTH = Dimensions.get('window').width;
    const GRID_SIZE = Math.sqrt(game.pieces);
    const TILE_SIZE = (WINDOW_WIDTH - 32) / GRID_SIZE;

    const [tiles, setTiles] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [emptyIndex, setEmptyIndex] = useState(game.pieces - 1);

    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        const numbers = Array.from({ length: game.pieces - 1 }, (_, i) => i);
        const shuffled = [...numbers, -1].sort(() => Math.random() - 0.5);
        setTiles(shuffled);
        setEmptyIndex(shuffled.indexOf(-1));
        setMoves(0);
    };

    const canMove = (index: number) => {
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
        const emptyCol = emptyIndex % GRID_SIZE;

        return (
            (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
            (Math.abs(col - emptyCol) === 1 && row === emptyRow)
        );
    };

    const handleTilePress = (index: number) => {
        if (!canMove(index)) return;

        const newTiles = [...tiles];
        newTiles[emptyIndex] = tiles[index];
        newTiles[index] = -1;
        setTiles(newTiles);
        setEmptyIndex(index);
        setMoves(moves + 1);

        // Check if puzzle is solved
        if (isComplete(newTiles)) {
            handleGameComplete();
        }
    };

    const isComplete = (currentTiles: number[]) => {
        return currentTiles.every((tile, index) => 
            index === currentTiles.length - 1 ? tile === -1 : tile === index
        );
    };

    const handleGameComplete = () => {
        const score = Math.max(game.points - Math.floor(moves / 10) * 5, 10);
        Alert.alert(
            "Chúc mừng! 🎉",
            `Bạn đã hoàn thành với ${moves} bước!\nĐiểm số: ${score}`,
            [
                {
                    text: "Chơi lại",
                    onPress: initGame,
                    style: "cancel"
                },
                {
                    text: "Quay lại",
                    onPress: () => router.back()
                }
            ]
        );
    };

    return (
        <View className="flex-1">
            {/* Stats */}
            <View className="p-4 bg-violet-50">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <MaterialIcons name="refresh" size={24} color="#7C3AED" />
                        <Text className="text-violet-600 font-medium ml-2">
                            Số bước: {moves}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Puzzle Grid */}
            <View className="flex-1 p-4 items-center justify-center">
                <View 
                    style={{ 
                        width: TILE_SIZE * GRID_SIZE, 
                        height: TILE_SIZE * GRID_SIZE 
                    }}
                    className="bg-gray-100 rounded-xl overflow-hidden"
                >
                    {tiles.map((tile, index) => (
                        <Pressable
                            key={index}
                            style={{
                                position: 'absolute',
                                width: TILE_SIZE,
                                height: TILE_SIZE,
                                left: (index % GRID_SIZE) * TILE_SIZE,
                                top: Math.floor(index / GRID_SIZE) * TILE_SIZE,
                            }}
                            onPress={() => handleTilePress(index)}
                        >
                            {tile !== -1 && (
                                <View className="flex-1 border border-white bg-violet-500 items-center justify-center">
                                    <Text className="text-white font-bold text-lg">
                                        {tile + 1}
                                    </Text>
                                </View>
                            )}
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Bottom Bar */}
            <View className="p-4 border-t border-gray-100">
                <Pressable
                    className="bg-violet-500 p-4 rounded-xl flex-row items-center justify-center"
                    onPress={initGame}
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