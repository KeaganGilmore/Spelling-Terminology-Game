// src/utils/api.ts
import urls from '../config/urls';
import { STORAGE_KEYS } from '../config/storage_names';
import type { GameConfig, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || urls.ORIGINAL_BASE_URL;

export const decryptGameSeed = async (seed: string): Promise<GameConfig> => {
    const token = localStorage.getItem(STORAGE_KEYS.STUDENT_TOKEN);
    console.log('token', token);
    const response = await fetch(`${urls.SLIDES_MICROSERVICE_URL}/decrypt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ encrypted: seed }),
    });
    console.log('response', response);

    if (!response.ok) {
        throw new Error('Failed to decrypt game seed');
    }

    const data: ApiResponse = await response.json();
    return data.data;
};