export const calculateWPM = (
    charCount: number,
    startTime: number,
    endTime: number = Date.now()
): number => {
    if (!startTime) return 0;
    const timeInMinutes = (endTime - startTime) / 60000;
    if (timeInMinutes <= 0) return 0;
    // Standard: 5 characters = 1 word
    const words = charCount / 5;
    return Math.round(words / timeInMinutes);
};

export const calculateAccuracy = (
    correctCount: number,
    totalTyped: number
): number => {
    if (totalTyped === 0) return 100;
    return Math.round((correctCount / totalTyped) * 100);
};

export const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};
