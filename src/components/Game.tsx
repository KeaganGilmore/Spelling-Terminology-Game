import React, { useState } from 'react';
import { useGameConfig } from '../hooks/useGameConfig';
import './Game.css';

export const Game: React.FC = () => {
    const { config, loading, error } = useGameConfig();
    const [score, setScore] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleAnswerSubmit = () => {
        // Logic to check the answer and update the score
        if (userAnswer === config?.currentQuestion) {
            setScore(score + 1);
        } else {
            setScore(score - 1);
        }
        setUserAnswer('');
    };

    return (
        <div className="game">
            <h2>Current Score: {score}</h2>
            <div className="question">
                <p>{config?.currentQuestion}</p>
            </div>
            <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your answer"
            />
            <button onClick={handleAnswerSubmit}>Submit Answer</button>
        </div>
    );
};