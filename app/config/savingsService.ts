import axios from 'axios';
import { API_URL } from './authService';
import { auth } from './firebase';

const getHeaders = async () => {
    const token = await auth.currentUser?.getIdToken();
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const savingsService = {
    getMyGoals: async () => {
        const headers = await getHeaders();
        const response = await axios.get(`${API_URL}/savings`, headers);
        return response.data;
    },

    createGoal: async (goalData: any) => {
        const headers = await getHeaders();
        const response = await axios.post(`${API_URL}/savings`, goalData, headers);
        return response.data;
    },

    deposit: async (goalId: string, amount: number, method: string) => {
        const headers = await getHeaders();
        const response = await axios.post(`${API_URL}/savings/${goalId}/deposit`, { amount, method }, headers);
        return response.data;
    },

    withdraw: async (goalId: string, amount: number, method: string, details: any) => {
        const headers = await getHeaders();
        const response = await axios.post(`${API_URL}/savings/${goalId}/withdraw`, { 
            amount, 
            method,
            phoneNumber: details.phoneNumber,
            bankDetails: details.bankDetails 
        }, headers);
        return response.data;
    }
};
