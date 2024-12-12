import React, { useState, useEffect } from 'react';
import { DecryptedSeed } from '../types';
import { Volume2, Check, X, RefreshCw } from 'lucide-react';
import styles from './SpellingTest.module.css';

interface SpellingTestProps {
    seedData: DecryptedSeed;
    onComplete: () => void;
}

const SpellingTest: React.FC<SpellingTestProps> = ({ seedData, onComplete }) => {
    const words = Object.entries(seedData.words);
    const selectedWords = words.slice(0, Math.min(words.length, 10));
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [spelling, setSpelling] = useState<string>('');
    const [results, setResults] = useState<{ word: string, correct: boolean, userAnswer: string }[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string, type: 'correct' | 'incorrect' } | null>(null);

    const handleSpellingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpelling(e.target.value);
        setFeedback(null);
    };

    const handleNextWord = () => {
        const [correctWord] = selectedWords[currentWordIndex];
        const isCorrect = spelling.toLowerCase().trim() === correctWord.toLowerCase().trim();

        const newResult = {
            word: correctWord,
            correct: isCorrect,
            userAnswer: spelling
        };

        setResults((prev) => [...prev, newResult]);

        setFeedback({
            message: isCorrect
                ? "Awesome! You spelled that perfectly! 🎉"
                : `Oops! The correct spelling is "${correctWord}". Keep trying! 💪`,
            type: isCorrect ? 'correct' : 'incorrect'
        });

        if (currentWordIndex < selectedWords.length - 1) {
            setTimeout(() => {
                setCurrentWordIndex((prev) => prev + 1);
                setSpelling('');
                setFeedback(null);
            }, 1500);
        } else {
            setTimeout(() => {
                setSubmitted(true);
                onComplete();
            }, 1500);
        }
    };

    const handleListen = () => {
        const word = selectedWords[currentWordIndex][0];
        const utterance = new SpeechSynthesisUtterance(word);
        speechSynthesis.speak(utterance);
    };

    const handleRestart = () => {
        setCurrentWordIndex(0);
        setSpelling('');
        setResults([]);
        setSubmitted(false);
        setFeedback(null);
    };

    return (
        <div className={styles.spellingTestContainer}>
            <div className={styles.spellingTestCard}>
                <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">Spelling Adventure 📝</h2>

                {!submitted ? (
                    <div className="space-y-4">
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleListen}
                                className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors shadow-md"
                                aria-label="Listen to word"
                            >
                                <Volume2 size={24} />
                            </button>
                        </div>

                        {feedback && (
                            <div className={`text-center p-4 rounded-lg shadow-sm ${
                                feedback.type === 'correct'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {feedback.message}
                            </div>
                        )}

                        <div className="flex space-x-4">
                            <input
                                type="text"
                                value={spelling}
                                onChange={handleSpellingChange}
                                placeholder="Type the word you hear"
                                className="flex-grow p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
                                autoComplete="off"
                            />
                            <button
                                onClick={handleNextWord}
                                disabled={!spelling.trim()}
                                className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors shadow-md"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-center text-purple-700">Your Spelling Results 🏆</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {results.map((result, index) => (
                                <div
                                    key={index}
                                    className={`flex justify-between p-3 rounded-lg shadow-sm ${
                                        result.correct
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    <div>
                                        <strong>{result.word}</strong>
                                        {!result.correct && (
                                            <span className="ml-2 text-sm">
                                                (You wrote: {result.userAnswer})
                                            </span>
                                        )}
                                    </div>
                                    {result.correct ? <Check size={24} /> : <X size={24} />}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={handleRestart}
                                className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 flex items-center space-x-2 shadow-md"
                            >
                                <RefreshCw size={20} />
                                <span>Try Again</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpellingTest;