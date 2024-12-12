// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { saveToken } from '../utils/authDB';

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const urlToken = params.get('token');
            if (urlToken) {
                saveToken(urlToken);
                setToken(urlToken);
            } else {
                setError('No token found in URL');
            }
        } catch (err) {
            setError('Failed to parse token from URL');
        }
    }, []);

    return { token, error };
};