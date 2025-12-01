/**
 * Spaced Repetition System (SRS) Logic based on SM-2 Algorithm
 */

export interface SRSProgress {
    verseRef: string;
    nextReview: Date;
    interval: number; // days
    easeFactor: number;
    repetitions: number;
}

/**
 * Calculate next review schedule based on performance rating (0-5)
 * 0: Complete blackout
 * 1: Incorrect response; the correct one remembered
 * 2: Incorrect response; where the correct one seemed easy to recall
 * 3: Correct response recalled with serious difficulty
 * 4: Correct response after a hesitation
 * 5: Perfect response
 */
export function calculateNextReview(
    current: SRSProgress,
    rating: number
): SRSProgress {
    let { interval, easeFactor, repetitions } = current;

    if (rating >= 3) {
        if (repetitions === 0) {
            interval = 1;
        } else if (repetitions === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        repetitions += 1;
    } else {
        repetitions = 0;
        interval = 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return {
        verseRef: current.verseRef,
        nextReview,
        interval,
        easeFactor,
        repetitions,
    };
}
