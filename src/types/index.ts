// src/types/index.ts
export interface GameState {
    score: number;
    isGameOver: boolean;
    currentQuestion?: string;
    userAnswer?: string;
}


export interface ImageAsset {
    id: string;
    url: string;
    label: string;
}

export interface ApiResponse {
    success: boolean;
    data: GameConfig;
}

export interface Question {
    content: string;
    answer_expected: string;
    answer_given: string;
    pass: boolean;
    response_time: number;
}

export interface GameData {
    seed: string;
    questions: Question[];
}

// src/types/index.ts
export interface DecryptedSeed {
    difficulty?: number;
    words: {
        [key: string]: string;
    };
}

export interface GameConfig {
    seedData: DecryptedSeed;
    gameType: string;
    difficulty: string;
    timeLimit?: number;
    images?: ImageAsset[];
    currentQuestion?: string;
    seed: string;
}