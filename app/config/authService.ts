import axios from 'axios';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

import { Platform } from 'react-native';

// Use EXPO_PUBLIC_ prefix to expose environment variables at build time
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://zamani-backend.onrender.com/api';

export const authService = {
    // Signup logic
    signup: async (name: string, email: string, password: string, additionalData: any) => {
        try {
            // 1. Create user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Firebase Display Name
            await updateProfile(user, { displayName: name });

            // 3. Create user in our MongoDB backend
            const response = await axios.post(`${API_URL}/users`, {
                firebaseId: user.uid,
                email: user.email,
                name: name,
                ...additionalData
            });

            return { user, backendUser: response.data };
        } catch (error: any) {
            throw error;
        }
    },

    // Login logic
    login: async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error: any) {
            throw error;
        }
    },

    // Logout logic
    logout: async () => {
        try {
            await signOut(auth);
        } catch (error: any) {
            throw error;
        }
    }
};
