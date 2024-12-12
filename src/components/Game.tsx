// src/components/Game.tsx
import React, { useState, useEffect } from 'react';
import { useGameConfig } from '../hooks/useGameConfig';
import StudySession from './StudySession';
import DefinitionEntry from './DefinitionEntry';
import './Game.css';

export const Game: React.FC = () => {
    const { config, loading, error } = useGameConfig();
    const [score, setScore] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [gameState, setGameState] = useState<'start' | 'study' | 'definition'>('start');

    useEffect(() => {
        console.log('Game component mounted');
    }, []);

    useEffect(() => {
        console.log('Game config:', config);
    }, [config]);

    if (loading) return <div>Loading...</div>;
    if (error) {
        console.error('Error loading game config:', error);
        return <div>Something went wrong. Please try again later.</div>;
    }

    const handleStart = () => {
        console.log('Starting study session');
        setGameState('study');
    };

    const handleStudyComplete = () => {
        console.log('Study session complete, starting definition entry');
        setGameState('definition');
    };

    return (
        <div className="game">
            {gameState === 'start' ? (
                <div>
                    <h2>Welcome to the Game</h2>
                    <button onClick={handleStart}>Start Study Session</button>
                </div>
            ) : gameState === 'study' ? (
                config && config.seedData && <StudySession seedData={config.seedData} onComplete={handleStudyComplete} />
            ) : (
                config && config.seedData && <DefinitionEntry seedData={config.seedData} />
            )}
        </div>
    );
};