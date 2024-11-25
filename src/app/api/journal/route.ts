import connectMongoDB from "@/libs/mongodb";
import JournalEntry from "@/models/journal-entry-schema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import User from "@/models/user-schema";
import { resolve } from "path";

export async function POST(request: NextRequest){
//     const {user, title, content, prompt, moodString } = await request.json();
//     if (!user) {
//         return NextResponse.json({ message: "User is required" }, { status: 400 });
//     }
//     await connectMongoDB();
//     await JournalEntry.create({user,title, content, prompt, moodString});
//     return NextResponse.json({message: "Item added successfully"}, {status: 201});
//
const { title, content, prompt, moodString, user } = await request.json();
  await connectMongoDB();
  // Check if user exists in database using email or user ID
  const userRecord = await User.findOne({ email: user }); // Assuming you pass email in the request
  if (!userRecord) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const userId = userRecord._id;  // MongoDB ObjectId of user
  
  
  
  // Create journal entry with MongoDB ObjectId
  await JournalEntry.create({
    user: userId, // This will store the actual ObjectId reference
    title,
    content,
    prompt,
    moodString,
  });

  return NextResponse.json({ message: "Entry added successfully!" }, { status: 201 }); 
}

export async function GET() {
    await connectMongoDB();
    const entries = await JournalEntry.find();
    return NextResponse.json({ entries });
}