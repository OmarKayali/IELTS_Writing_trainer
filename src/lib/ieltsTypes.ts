// Comprehensive IELTS evaluation type definitions

/**
 * Band upgrade suggestion - shows specific actions to reach next band level
 */
export interface BandUpgradeSuggestion {
    currentBand: number;
    targetBand: number;
    suggestions: string[]; // Specific actionable items
}

/**
 * Error pattern tracking - identifies recurring mistakes in student writing
 */
export interface ErrorPattern {
    type: 'grammar' | 'vocabulary' | 'coherence' | 'task';
    description: string;
    examples: string[]; // Quotes from essay showing the error
    frequency: 'rare' | 'occasional' | 'frequent';
    severity: 'minor' | 'moderate' | 'severe';
}

/**
 * Vocabulary improvement suggestion - specific word alternatives
 */
export interface VocabSuggestion {
    original: string; // Word/phrase from essay
    alternatives: string[]; // IELTS-appropriate alternatives
    context: string; // Sentence containing the word
    reason: string; // Why to change (e.g., "repetition", "informal tone")
}

/**
 * Feedback structure from AI examiner
 */
export interface ExaminerFeedback {
    strengths: string[];     // What the student did well
    improvements: string[];  // Areas that need work
    tips: string[];          // Actionable advice
}

/**
 * Complete IELTS evaluation result
 */
export interface IELTSEvaluation {
    criteria: {
        taskAchievement?: number; // Task 1: 0.0 to 9.0 in 0.5 increments
        taskResponse?: number;    // Task 2: 0.0 to 9.0 in 0.5 increments
        coherence: number;
        lexical: number;
        grammar: number;
    };
    overallBand: number; // Average rounded to nearest 0.5
    feedback: ExaminerFeedback; // Structured feedback
    modelAnswer: string; // Band 8-9 model answer
    wordCount: number; // User essay word count
    taskType?: 'Task 1' | 'Task 2'; // Which task type
    wordCountPenalty?: boolean; // True if below minimum
    bandUpgrades?: BandUpgradeSuggestion[]; // How to reach next band
    errorPatterns?: ErrorPattern[]; // Recurring mistakes
    vocabularyImprovements?: VocabSuggestion[]; // Specific word alternatives
}
