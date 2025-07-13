
import type { RawPsqiData, PsqiScoreData, PsqiComponentScores } from '../types';

// --- Helper Parsers ---

const parseFrequency = (text: string): number => {
    const s = String(text || '').toLowerCase().replace(/[/／]/g, '');
    if (s.includes('无') || s.includes('none') || s === '') return 0;
    if (s.includes('<1') || s.includes('＜1') || s.includes('less than once')) return 1;
    if (s.includes('1-2') || s.includes('1–2')) return 2;
    if (s.includes('>=3') || s.includes('>或=3') || s.includes('≥3') || s.includes('3 or more')) return 3;
    return 0; // Default case for unexpected formats
};

const parseMinutes = (text: string): number => {
    const match = String(text || '').match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
};

const parseHours = (text: string): number => {
    const match = String(text || '').match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
};

const parseTime = (text: string): { hour: number, minute: number } => {
    const cleaned = String(text || '').replace(/点/g, ':').replace(/分/g, '').replace(/\s/g, '');
    const parts = cleaned.split(':');
    const hour = parseInt(parts[0], 10) || 0;
    const minute = parts.length > 1 ? parseInt(parts[1], 10) || 0 : 0;
    return { hour, minute };
};

/**
 * Maps a sum of individual item scores to a final component score based on thresholds.
 * This is used for components where sub-item scores are summed and then categorized.
 * @param sum The sum of the scores of sub-items.
 * @param thresholds An array of two numbers representing the upper bounds for score 1 and 2.
 * e.g., for [9, 18]: sum 0 -> 0; 1-9 -> 1; 10-18 -> 2; >18 -> 3.
 * @returns The final component score (0-3).
 */
const mapSumToComponentScore = (sum: number, thresholds: [number, number]): number => {
    if (sum === 0) return 0;
    if (sum <= thresholds[0]) return 1;
    if (sum <= thresholds[1]) return 2;
    return 3;
};


// --- Component Calculators ---

const calculateComponent1 = (q6: string): number => {
    const s = String(q6 || '').trim();
    if (s.includes('很好')) return 0;
    if (s.includes('较好')) return 1;
    if (s.includes('较差')) return 2;
    if (s.includes('很差')) return 3;
    return 0;
};

const calculateComponent2 = (q2: string, q5a: string): number => {
    const timeToSleep = parseMinutes(q2);
    let scoreQ2 = 0;
    if (timeToSleep <= 15) scoreQ2 = 0;
    else if (timeToSleep <= 30) scoreQ2 = 1;
    else if (timeToSleep <= 60) scoreQ2 = 2;
    else scoreQ2 = 3;
    
    const scoreQ5a = parseFrequency(q5a);
    const sum = scoreQ2 + scoreQ5a;

    // Rule: sum 0 -> 0; 1-2 -> 1; 3-4 -> 2; 5-6 -> 3
    return mapSumToComponentScore(sum, [2, 4]);
};

const calculateComponent3 = (q4: string): number => {
    const sleepHours = parseHours(q4);
    if (sleepHours > 7) return 0;
    if (sleepHours >= 6) return 1; // This now correctly covers the range [6, 7]
    if (sleepHours >= 5) return 2;
    return 3;
};

const calculateComponent4 = (q1: string, q3: string, q4: string): number => {
    const bedTime = parseTime(q1);
    const wakeTime = parseTime(q3);

    let bedTimeInMinutes = bedTime.hour * 60 + bedTime.minute;
    let wakeTimeInMinutes = wakeTime.hour * 60 + wakeTime.minute;
    
    // Handle overnight sleep
    if (wakeTimeInMinutes <= bedTimeInMinutes) {
        wakeTimeInMinutes += 24 * 60;
    }
    
    const timeInBedMinutes = wakeTimeInMinutes - bedTimeInMinutes;
    if (timeInBedMinutes <= 0) return 3; // Should not happen with valid data

    const actualSleepMinutes = parseHours(q4) * 60;
    if (actualSleepMinutes <= 0) return 3;

    const efficiency = (actualSleepMinutes / timeInBedMinutes) * 100;
    
    if (efficiency >= 85) return 0;
    if (efficiency >= 75) return 1;
    if (efficiency >= 65) return 2;
    return 3;
};

const calculateComponent5 = (data: RawPsqiData): number => {
    const disturbances = [
        data.q5b, data.q5c, data.q5d, data.q5e, data.q5f, 
        data.q5g, data.q5h, data.q5i, data.q5j
    ];
    const sum = disturbances.reduce((acc, text) => acc + parseFrequency(text), 0);

    // Rule: sum 0 -> 0; 1-9 -> 1; 10-18 -> 2; 19-27 -> 3
    return mapSumToComponentScore(sum, [9, 18]);
};

const calculateComponent6 = (q7: string): number => {
    return parseFrequency(q7);
};

const calculateComponent7 = (q8: string, q9: string): number => {
    const scoreQ8 = parseFrequency(q8);
    let scoreQ9 = 0;
    const s = String(q9 || '').trim();
    if (s.includes('无')) scoreQ9 = 0;
    else if (s.includes('偶尔')) scoreQ9 = 1;
    else if (s.includes('有时')) scoreQ9 = 2;
    else if (s.includes('经常')) scoreQ9 = 3;

    const sum = scoreQ8 + scoreQ9;

    // Rule: sum 0 -> 0; 1-2 -> 1; 3-4 -> 2; 5-6 -> 3
    return mapSumToComponentScore(sum, [2, 4]);
};


// --- Main Orchestrator ---

export const calculateAllPsqiScores = (rawData: RawPsqiData[]): PsqiScoreData[] => {
    return rawData.map(data => {
        // Defensive check for data row validity
        if (!data || !data.id) {
            return null;
        }

        const scores: PsqiComponentScores = {
            c1_sleepQuality: calculateComponent1(data.q6),
            c2_sleepLatency: calculateComponent2(data.q2, data.q5a),
            c3_sleepDuration: calculateComponent3(data.q4),
            c4_sleepEfficiency: calculateComponent4(data.q1, data.q3, data.q4),
            c5_sleepDisturbances: calculateComponent5(data),
            c6_useOfMedication: calculateComponent6(data.q7),
            c7_daytimeDysfunction: calculateComponent7(data.q8, data.q9),
        };

        const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

        return {
            id: data.id,
            name: data.name,
            age: data.age,
            scores: scores,
            totalScore: totalScore
        };
    }).filter((result): result is PsqiScoreData => result !== null); // Filter out any empty/invalid rows
};
