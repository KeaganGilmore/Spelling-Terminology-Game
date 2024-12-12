// src/components/Game.tsx
import React, { useState, useEffect } from 'react';
import { useGameConfig } from '../hooks/useGameConfig';
import StudySession from './StudySession';
import SpellingTest from './SpellingTest';
import DefinitionEntry from './DefinitionEntry';
import './Game.css';

export const Game: React.FC = () => {
    const { config, loading, error } = useGameConfig();
    const [gameState, setGameState] = useState<'start' | 'study' | 'spelling' | 'definition'>('start');

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
        if (!config || !config.seedData || !config.seedData.words || Object.keys(config.seedData.words).length === 0) {
            console.error('No words found in seed data');
            return; // We can also show a message on the UI here if needed
        }
        setGameState('study');
    };

    const handleStudyComplete = () => {
        console.log('Study session complete, starting spelling test');
        setGameState('spelling');
    };

    const handleSpellingComplete = () => {
        console.log('Spelling test complete, starting definition entry');
        setGameState('definition');
    };

    if (!config || !config.seedData || !config.seedData.words || Object.keys(config.seedData.words).length === 0) {
        return (
            <div className="game">
                <h2>No word data found!</h2>
                <p>Cannot start the game without any words to study.</p>
            </div>
        );
    }

    return (
        <div className="game">
            {gameState === 'start' ? (
                <div>
                    <h2>Welcome to the Game</h2>
                    <button onClick={handleStart}>Start Study Session</button>
                </div>
            ) : gameState === 'study' ? (
                <StudySession seedData={config.seedData} onComplete={handleStudyComplete} />
            ) : gameState === 'spelling' ? (
                <SpellingTest seedData={config.seedData} onComplete={handleSpellingComplete} />
            ) : (
                <DefinitionEntry seedData={config.seedData} />
            )}
        </div>
    );
};