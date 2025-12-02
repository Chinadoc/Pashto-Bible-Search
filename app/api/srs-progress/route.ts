import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { calculateNextReview, SRSProgress } from "@/app/lib/srs";

export const runtime = "edge";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { verseRef, rating } = await req.json();
        if (!verseRef || typeof rating !== 'number') {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const db = process.env.DB as any;

        // Fetch current progress
        const current = await db.prepare(
            "SELECT * FROM srs_progress WHERE user_id = ? AND verse_ref = ?"
        ).bind(session.user.id, verseRef).first();

        let progress: SRSProgress;

        if (current) {
            progress = {
                verseRef,
                nextReview: new Date(current.next_review),
                interval: current.interval,
                easeFactor: current.ease_factor,
                repetitions: current.repetitions,
            };
        } else {
            // Initialize if not exists
            progress = {
                verseRef,
                nextReview: new Date(),
                interval: 0,
                easeFactor: 2.5,
                repetitions: 0,
            };
        }

        // Calculate new progress
        const updated = calculateNextReview(progress, rating);

        // Update DB
        await db.prepare(
            `INSERT OR REPLACE INTO srs_progress 
      (user_id, verse_ref, next_review, interval, ease_factor, repetitions, last_reviewed) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            session.user.id,
            verseRef,
            updated.nextReview.toISOString(),
            updated.interval,
            updated.easeFactor,
            updated.repetitions,
            new Date().toISOString()
        ).run();

        return NextResponse.json({ success: true, nextReview: updated.nextReview });
    } catch (error) {
        console.error("Error updating SRS progress:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = process.env.DB as any;

        // Get verses due for review (or all saved verses with their status)
        const { results } = await db.prepare(`
      SELECT 
        sv.verse_ref, 
        sp.next_review, 
        sp.interval, 
        sp.repetitions 
      FROM saved_verses sv
      LEFT JOIN srs_progress sp ON sv.user_id = sp.user_id AND sv.verse_ref = sp.verse_ref
      WHERE sv.user_id = ?
    `).bind(session.user.id).all();

        return NextResponse.json({ items: results });
    } catch (error) {
        console.error("Error fetching SRS items:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
