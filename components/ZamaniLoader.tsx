import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Easing } from 'react-native';

const COLORS = {
    heritage: "#F5EFE7", // Savannah Stone
};

export const ZamaniLoader = () => {
    const scaleValue = new Animated.Value(0.8);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 1.1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 0.8,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/images/zamani.png')}
                style={[
                    styles.logo,
                    { transform: [{ scale: scaleValue }] }
                ]}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.heritage,
    },
    logo: {
        width: 120,
        height: 120,
    },
});
