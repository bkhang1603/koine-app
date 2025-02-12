import React from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MOCK_GAMES } from "@/constants/mock-data";
import HeaderWithBack from "@/components/HeaderWithBack";
import MemoryGame from "./[id]/memory";
import PuzzleGame from "./[id]/puzzle";
import QuizGame from "./[id]/quiz";

type Game = {
    id: string;
    title: string;
    type: "memory" | "puzzle" | "quiz";
    points: number;
} & (
    | { type: "memory"; cards: string[] }
    | { type: "puzzle"; image: string; pieces: number }
    | {
          type: "quiz";
          questions: Array<{
              id: string;
              question: string;
              options: string[];
              correct: number;
          }>;
      }
);

export default function GameScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const game = MOCK_GAMES.find((g) => g.id === id) as Game;

    if (!game) return null;

    const renderGame = () => {
        switch (game.type) {
            case "memory":
                return <MemoryGame game={game} />;
            case "puzzle":
                return <PuzzleGame game={game} />;
            case "quiz":
                return <QuizGame game={game} />;
            default:
                return null;
        }
    };

    return (
        <View className="flex-1 bg-white">
            <HeaderWithBack title={game.title} />
            {renderGame()}
        </View>
    );
}
