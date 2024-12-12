import React, { useState, useEffect } from 'react';
import { DecryptedSeed } from '../types';
import styles from './StudySession.module.css';

type SessionType = 'sequential' | 'simultaneous';

interface StudySessionProps {
    seedData: DecryptedSeed;
    onComplete: () => void;
}

const StudySession: React.FC<StudySessionProps> = ({ seedData, onComplete }) => {
    const difficulty = seedData.difficulty ?? 10;
    const words = Object.entries(seedData.words || {});

    // Always call hooks at the top-level, unconditionally
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(difficulty);
    const [sessionType, setSessionType] = useState<SessionType>('sequential');
    const [simultaneousTimeLeft, setSimultaneousTimeLeft] = useState(difficulty * words.length || 30);
    const [completedSession, setCompletedSession] = useState(false);

    const getDynamicFontSize = (word: string) => {
        const baseSize = 1.8;
        const maxLength = 15;
        const minSize = 1;

        if (word.length > maxLength) {
            return Math.max(
                minSize,
                baseSize - (word.length - maxLength) * 0.1
            );
        }
        return baseSize;
    };

    useEffect(() => {
        setSessionType(Math.random() < 0.5 ? 'sequential' : 'simultaneous');
    }, []);

    const goToNextWord = () => {
        if (currentWordIndex < words.length - 1) {
            const additionalTime = timeLeft;
            setCurrentWordIndex((prev) => prev + 1);
            setTimeLeft(Math.min(
                difficulty + additionalTime,
                difficulty * 2
            ));
        } else {
            setCompletedSession(true);
            onComplete();
        }
    };

    useEffect(() => {
        if (sessionType === 'sequential') {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime > 1) {
                        return prevTime - 1;
                    } else {
                        clearInterval(timer);
                        if (currentWordIndex < words.length - 1) {
                            setCurrentWordIndex((prev) => prev + 1);
                            setTimeLeft(difficulty);
                        } else {
                            setCompletedSession(true);
                            onComplete();
                        }
                        return 0;
                    }
                });
            }, 1000);

            return () => clearInterval(timer);
        } else if (sessionType === 'simultaneous') {
            const timer = setInterval(() => {
                setSimultaneousTimeLeft((prevTime) => {
                    if (prevTime > 1) {
                        return prevTime - 1;
                    } else {
                        clearInterval(timer);
                        setCompletedSession(true);
                        onComplete();
                        return 0;
                    }
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [currentWordIndex, difficulty, words.length, sessionType, onComplete]);

    // Handle empty words scenario in the return statement
    if (words.length === 0) {
        return (
            <div className={styles.studyContainer}>
                <h1>No words to study</h1>
                <p>Please provide valid seedData with words.</p>
            </div>
        );
    }

    if (completedSession) {
        return (
            <div className={styles.completedOverlay}>
                <h1 className={styles.completedTitle}>Study Session Complete!</h1>
                <p>Great job mastering your words!</p>
            </div>
        );
    }

    return (
        <div className={styles.studyContainer}>
            <div className={styles.timerTopRight}>
                {sessionType === 'sequential' ? timeLeft : simultaneousTimeLeft} s
            </div>
            <h1 className={styles.sessionTitle}>
                {sessionType === 'sequential' ? 'Sequential Study' : 'Simultaneous Study'}
            </h1>

            {sessionType === 'sequential' ? (
                <div className={styles.wordCard}>
                    <h2
                        className={styles.wordForeground}
                        style={{
                            fontSize: `${getDynamicFontSize(words[currentWordIndex][0])}rem`
                        }}
                    >
                        {words[currentWordIndex][0]}
                    </h2>
                    <p
                        className={styles.wordTranslation}
                        style={{
                            fontSize: `${getDynamicFontSize(words[currentWordIndex][1]) - 0.4}rem`
                        }}
                    >
                        {words[currentWordIndex][1]}
                    </p>
                    <div className={styles.timerActions}>
                        {currentWordIndex < words.length - 1 && (
                            <button
                                onClick={goToNextWord}
                                className={styles.nextButton}
                            >
                                Next Word
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.simultaneousGrid}>
                    {words.map(([word, translation]) => (
                        <div
                            key={word}
                            className={styles.simultaneousWordCard}
                            style={{
                                fontSize: `${getDynamicFontSize(word)}rem`
                            }}
                        >
                            <h2
                                className={styles.wordForeground}
                                style={{
                                    fontSize: `${getDynamicFontSize(word)}rem`
                                }}
                            >
                                {word}
                            </h2>
                            <p
                                className={styles.wordTranslation}
                                style={{
                                    fontSize: `${getDynamicFontSize(translation) - 0.4}rem`
                                }}
                            >
                                {translation}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudySession;
