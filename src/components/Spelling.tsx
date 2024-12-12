// src/components/Spelling.tsx
import React, { useState } from 'react';
import { DecryptedSeed } from '../types';
import styles from './Spelling.module.css';

interface SpellingProps {
    seedData: DecryptedSeed;
    onComplete: () => void;
}

const Spelling: React.FC<SpellingProps> = ({ seedData, onComplete }) => {
    const words = Object.keys(seedData.words);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [results, setResults] = useState<boolean[]>(Array(words.length).fill(false));

    const speakWord = (word: string) => {
        const utterance = new SpeechSynthesisUtterance(word);
        speechSynthesis.speak(utterance);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserAnswer(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isCorrect = userAnswer.trim().toLowerCase() === words[currentWordIndex].toLowerCase();
        setResults((prev) => {
            const newResults = [...prev];
            newResults[currentWordIndex] = isCorrect;
            return newResults;
        });
        setUserAnswer('');
        if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className={styles.spellingContainer}>
            <h2>Spell the Word</h2>
            <div className={styles.wordContainer}>
                <span>{words[currentWordIndex]}</span>
                <button onClick={() => speakWord(words[currentWordIndex])} className={styles.speakButton}>
                    <img src="/microphone-icon.png" alt="Speak" />
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={handleChange}
                    autoComplete="off"
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                />
                <button type="submit">Submit</button>
            </form>
            <div className={styles.results}>
                {results.map((result, index) => (
                    <div key={index} className={result ? styles.correct : styles.incorrect}>
                        {words[index]}: {result ? 'Correct' : 'Incorrect'}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Spelling;