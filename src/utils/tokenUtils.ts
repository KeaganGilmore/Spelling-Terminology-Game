// src/utils.ts/tokenUtils.ts
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    exp: number;
}

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        console.log('Token expiration:', decoded.exp);
        console.log('Current time:', currentTime);
        return decoded.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true; // Assume token is expired if it can't be decoded
    }
};