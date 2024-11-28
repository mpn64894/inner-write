import connectMongoDB from "@/libs/mongodb";
import TodaysPlan from "@/models/todays-plan-schema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import User from "@/models/user-schema";
import { resolve } from "path";

export async function POST(request: NextRequest){

const { selectedHour, task, user } = await request.json();
  await connectMongoDB();
  // Check if user exists in database using email or user ID
  const userRecord = await User.findOne({ user: user }); // Assuming you pass email in the request
  if (!userRecord) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const userId = userRecord._id;  // MongoDB ObjectId of user
  
  // Create todays plan with MongoDB ObjectId
  await TodaysPlan.create({
    user: userId, // This will store the actual ObjectId reference
    selectedHour,
    task,
  });

  return NextResponse.json({ message: "Entry added successfully!" }, { status: 201 }); 
}

export async function GET(request: NextRequest) {
  const user = await request.headers.get("User");

  await connectMongoDB();

  const userRecord = await User.findOne({ email: user });
  if (!userRecord) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const userId = userRecord._id;
  const entries = await TodaysPlan.find({ user: userId });
  return NextResponse.json({ entries });
}