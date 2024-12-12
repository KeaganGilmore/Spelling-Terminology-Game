// src/hooks/useGameConfig.ts
import { useState, useEffect } from 'react';
import { decryptGameSeed } from '../utils/api';
import { useAuth } from './useAuth';
import { STORAGE_KEYS } from '../config/storage_names';
import type { GameConfig } from '../types';

export const useGameConfig = () => {
    const { token, error: authError } = useAuth();
    const [config, setConfig] = useState<GameConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initConfig = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const seed = params.get('seed');

                if (!seed) {
                    throw new Error('No seed provided');
                }

                // Save the seed in local storage
                localStorage.setItem(STORAGE_KEYS.GAME_SEED, seed);

                const gameConfig = await decryptGameSeed(seed);
                setConfig(gameConfig);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load game config');
            } finally {
                setLoading(false);
            }
        };

        initConfig();
    }, []);

    return { config, loading, error: error || authError };
};