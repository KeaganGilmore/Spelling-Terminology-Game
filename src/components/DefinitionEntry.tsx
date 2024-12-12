// src/components/DefinitionEntry.tsx
import React, { useState } from 'react';
import { DecryptedSeed } from '../types';
import { sendRequestV3 } from '../hooks/SendReq';
import styles from './DefinitionEntry.module.css';

interface DefinitionEntryProps {
    seedData: DecryptedSeed;
}

const DefinitionEntry: React.FC<DefinitionEntryProps> = ({ seedData }) => {
    const words = Object.entries(seedData.words);
    const [definitions, setDefinitions] = useState<{ [key: string]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<boolean[]>([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (word: string, definition: string) => {
        setDefinitions((prev) => ({ ...prev, [word]: definition }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const requests = words.map(([word, modelAnswer]) => ({
            question: word,
            modelAnswer,
            studentAnswer: definitions[word] || ''
        }));

        const response = await sendRequestV3({
            endpoint: '/utils/subjective/bool',
            method: 'POST',
            body: { requests }
        });

        const results = response.responses.map((result: boolean, index: number) => {
            const studentAnswer = requests[index].studentAnswer;
            return studentAnswer === '' ? false : result;
        });

        setResults(results);
        setSubmitted(true);
        setLoading(false);
    };

    const selectedWords = words.slice(0, Math.min(words.length, 10));

    return (
        <div className={styles.definitionEntryContainer}>
            <h2>Enter the Definitions</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {selectedWords.map(([word]) => (
                    <div key={word} className={styles.wordEntry}>
                        <label htmlFor={word}>{word}</label>
                        <input
                            type="text"
                            id={word}
                            value={definitions[word] || ''}
                            onChange={(e) => handleChange(word, e.target.value)}
                            disabled={submitted}
                            autoComplete="off"
                            onPaste={(e) => e.preventDefault()}
                            onCopy={(e) => e.preventDefault()}
                        />
                    </div>
                ))}
                {!submitted && <button type="submit">Submit</button>}
            </form>
            {loading && <div className={styles.loading}>Loading...</div>}
            {submitted && (
                <div className={styles.results}>
                    <h3>Results</h3>
                    {selectedWords.map(([word, correctDefinition], index) => (
                        <div key={word} className={styles.result}>
                            <p><strong>{word}:</strong> {definitions[word] || 'No answer'}</p>
                            <p><strong>Correct:</strong> {correctDefinition}</p>
                            <p><strong>Result:</strong> {results[index] ? 'Correct' : 'Incorrect'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DefinitionEntry;