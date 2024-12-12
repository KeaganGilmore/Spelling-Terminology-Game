// src/utils/authDB.ts
import { STORAGE_KEYS } from '../config/storage_names';
import Cookies from 'js-cookie';

export const saveToken = (token: string) => {
    try {
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.STUDENT_TOKEN, token);

        // Save to cookie without 'secure' flag
        Cookies.set(STORAGE_KEYS.AUTH_COOKIE, token, { sameSite: 'strict' });

        console.log('Token saved successfully');
    } catch (error) {
        console.error('Failed to save token:', error);
        throw error;
    }
};

export const getToken = (): string | null => {
    try {
        // Get from localStorage
        const tokenFromStorage = localStorage.getItem(STORAGE_KEYS.STUDENT_TOKEN);

        // Get from cookie
        const tokenFromCookie = Cookies.get(STORAGE_KEYS.AUTH_COOKIE);
        if (tokenFromStorage && tokenFromCookie && tokenFromStorage === tokenFromCookie) {
            return tokenFromStorage;
        }

        // If only one token exists, return it
        if (tokenFromStorage) {
            return tokenFromStorage;
        }
        if (tokenFromCookie) {
            return tokenFromCookie;
        }

        // If no tokens exist, return null
        return null;
    } catch (error) {
        console.error('Failed to retrieve token:', error);
        return null;
    }
};

export const clearToken = () => {
    try {
        // Clear from localStorage
        localStorage.removeItem(STORAGE_KEYS.STUDENT_TOKEN);

        // Clear from cookie
        Cookies.remove(STORAGE_KEYS.AUTH_COOKIE);

        console.log('Token cleared successfully');
    } catch (error) {
        console.error('Failed to clear token:', error);
        throw error;
    }
};