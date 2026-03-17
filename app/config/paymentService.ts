import axios from 'axios';
import { API_URL } from './authService';
import { auth } from './firebase';

export interface PaymentInitData {
    amount: number;
    currency?: string;
    email: string;
    name: string;
    phone?: string;
    type: 'Investment' | 'Deposit';
    referenceId: string;
    method?: string;
}

export const paymentService = {
    initialize: async (data: PaymentInitData) => {
        try {
            const token = await auth.currentUser?.getIdToken();
            const response = await axios.post(`${API_URL}/payments/initialize`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data; // { status: 'success', link: '...', reference: '...' }
        } catch (error: any) {
            console.error('Payment initialization failed:', error.response?.data || error.message);
            throw error;
        }
    },

    verify: async (reference: string) => {
        try {
            const token = await auth.currentUser?.getIdToken();
            const response = await axios.get(`${API_URL}/payments/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data; // { status: 'Completed' | 'Pending' | 'Failed', ... }
        } catch (error: any) {
            console.error('Payment verification failed:', error.response?.data || error.message);
            throw error;
        }
    }
};
