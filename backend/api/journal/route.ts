import connectMongoDB from "../../libs/mongodb";
import JournalEntry from "../../models/journal-entry-schema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server"


export async function POST(request: NextRequest){
    const {title, content, prompt, moodString } = await request.json();
    await connectMongoDB();
    await JournalEntry.create({title, content, prompt, moodString});
    return NextResponse.json({message: "Item added successfully"}, {status: 201});
}

export async function GET() {
    await connectMongoDB();
    const entries = await JournalEntry.find();
    return NextResponse.json({ entries });
}