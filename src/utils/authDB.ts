import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const STORAGE_KEY = 'authToken';
const COOKIE_NAME = 'authToken';

export const saveToken = (token: string) => {
    try {
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, token);

        // Save to cookie without 'secure' flag
        Cookies.set(COOKIE_NAME, token, { sameSite: 'strict' });

        console.log('Token saved successfully');
    } catch (error) {
        console.error('Failed to save token:', error);
        throw error;
    }
};
export const getToken = (): string | null => {
    try {
        // Get from localStorage
        const tokenFromStorage = localStorage.getItem(STORAGE_KEY);

        // Get from cookie
        const tokenFromCookie = Cookies.get(COOKIE_NAME);
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
        localStorage.removeItem(STORAGE_KEY);

        // Clear from cookie
        Cookies.remove(COOKIE_NAME);

        console.log('Token cleared successfully');
    } catch (error) {
        console.error('Failed to clear token:', error);
        throw error;
    }
};