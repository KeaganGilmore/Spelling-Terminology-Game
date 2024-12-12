// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { saveToken } from '../utils/authDB';

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('useAuth hook called');
        try {
            const params = new URLSearchParams(window.location.search);
            const urlToken = params.get('token');
            console.log('Token from URL:', urlToken);
            if (urlToken) {
                saveToken(urlToken);
                setToken(urlToken);
                console.log('Token saved:', urlToken);
            } else {
                setError('No token found in URL');
                console.log('No token found in URL');
            }
        } catch (err) {
            setError('Failed to parse token from URL');
            console.log('Failed to parse token from URL', err);
        }
    }, []);

    return { token, error };
};