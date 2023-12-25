export interface AiResult {
    probability: number;
    emoji: string;
}

export interface AiResults {
    [key: string]: AiResult[];
}