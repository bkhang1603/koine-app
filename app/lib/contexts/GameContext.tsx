import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type GameSettings = {
    difficulty: 'easy' | 'medium' | 'hard';
    vibrationEnabled: boolean;
};

type GameScore = {
    gameId: string;
    score: number;
    date: string;
};

type GameContextType = {
    settings: GameSettings;
    updateSettings: (settings: Partial<GameSettings>) => void;
    highScores: GameScore[];
    addScore: (score: GameScore) => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<GameSettings>({
        difficulty: 'medium',
        vibrationEnabled: true,
    });
    const [highScores, setHighScores] = useState<GameScore[]>([]);

    React.useEffect(() => {
        loadSettings();
        loadHighScores();
    }, []);

    const loadSettings = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem('gameSettings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.log('Error loading settings:', error);
        }
    };

    const loadHighScores = async () => {
        try {
            const savedScores = await AsyncStorage.getItem('highScores');
            if (savedScores) {
                setHighScores(JSON.parse(savedScores));
            }
        } catch (error) {
            console.log('Error loading high scores:', error);
        }
    };

    const updateSettings = async (newSettings: Partial<GameSettings>) => {
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
        try {
            await AsyncStorage.setItem('gameSettings', JSON.stringify(updatedSettings));
        } catch (error) {
            console.log('Error saving settings:', error);
        }
    };

    const addScore = async (score: GameScore) => {
        const newScores = [...highScores, score]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        setHighScores(newScores);
        try {
            await AsyncStorage.setItem('highScores', JSON.stringify(newScores));
        } catch (error) {
            console.log('Error saving high scores:', error);
        }
    };

    return (
        <GameContext.Provider value={{ settings, updateSettings, highScores, addScore }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

// Add default export to fix warning
export default GameProvider; 