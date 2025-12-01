import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { verseRef } = await req.json();
        if (!verseRef) {
            return NextResponse.json({ error: "Verse reference required" }, { status: 400 });
        }

        // Use D1 binding from environment
        const db = process.env.DB as any;

        // Insert into saved_verses
        await db.prepare(
            "INSERT OR IGNORE INTO saved_verses (user_id, verse_ref) VALUES (?, ?)"
        ).bind(session.user.id, verseRef).run();

        // Initialize SRS progress if not exists
        await db.prepare(
            "INSERT OR IGNORE INTO srs_progress (user_id, verse_ref, next_review, interval, ease_factor, repetitions) VALUES (?, ?, ?, 1, 2.5, 0)"
        ).bind(session.user.id, verseRef, new Date().toISOString()).run();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving verse:", error);
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
        const { results } = await db.prepare(
            "SELECT verse_ref FROM saved_verses WHERE user_id = ?"
        ).bind(session.user.id).all();

        return NextResponse.json({ savedVerses: results.map((r: any) => r.verse_ref) });
    } catch (error) {
        console.error("Error fetching saved verses:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
