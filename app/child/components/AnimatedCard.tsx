import React, { useEffect } from 'react';
import { Pressable, Text, Animated, StyleSheet } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

type AnimatedCardProps = {
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
    onPress: () => void;
    width: number;
    height?: number;
    style?: any;
};

export default function AnimatedCard({
    value,
    isFlipped,
    isMatched,
    onPress,
    width,
    height = width,
    style
}: AnimatedCardProps) {
    const animatedValue = new Animated.Value(isFlipped ? 180 : 0);
    const frontInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });
    const backInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: isFlipped ? 180 : 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    }, [isFlipped]);

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };
    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    return (
        <Pressable
            onPress={onPress}
            style={[{ width, height }, style]}
        >
            <Animated.View
                style={[
                    styles.cardContainer,
                    frontAnimatedStyle,
                    { width, height },
                    isMatched && styles.matchedCard
                ]}
            >
                <MaterialIcons name="help_outline" size={24} color="#7C3AED" />
            </Animated.View>
            <Animated.View
                style={[
                    styles.cardContainer,
                    styles.cardBack,
                    backAnimatedStyle,
                    { width, height },
                    isMatched && styles.matchedCard
                ]}
            >
                <Text style={styles.cardText}>{value}</Text>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#EDE9FE',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backfaceVisibility: 'hidden',
    },
    cardBack: {
        backgroundColor: '#7C3AED',
    },
    cardText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    matchedCard: {
        backgroundColor: '#10B981',
        opacity: 0.8,
    },
}); 