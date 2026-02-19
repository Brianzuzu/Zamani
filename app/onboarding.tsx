import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: 1,
        title: 'Build Remotely',
        description: 'Manage and coordinate your construction projects from anywhere in the world.',
        color: '#0A1F44', // Deep Blue
    },
    {
        id: 2,
        title: 'Save Securely',
        description: 'Lock away your funds for specific goals with bank-grade security.',
        color: '#0B3D2E', // Dark Emerald
    },
    {
        id: 3,
        title: 'Track Progress',
        description: 'Monitor every milestone and stay on top of your development journey.',
        color: '#0A1F44', // Deep Blue
    },
];

export default function Onboarding() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            router.replace('/(auth)/login');
        }
    };

    const handleSkip = () => {
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={[styles.imagePlaceholder, { backgroundColor: SLIDES[currentSlide].color + '20' }]}>
                    {/* Illustration would go here */}
                    <View style={[styles.circle, { backgroundColor: SLIDES[currentSlide].color }]} />
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: SLIDES[currentSlide].color }]}>
                        {SLIDES[currentSlide].title}
                    </Text>
                    <Text style={styles.description}>
                        {SLIDES[currentSlide].description}
                    </Text>
                </View>

                <View style={styles.pagination}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                { backgroundColor: index === currentSlide ? SLIDES[currentSlide].color : '#E0E0E0' },
                                index === currentSlide && styles.activeDot
                            ]}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: SLIDES[currentSlide].color }]}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>
                        {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
    },
    skipText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    imagePlaceholder: {
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 20,
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
    },
    button: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
