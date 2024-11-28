import connectMongoDB from "@/libs/mongodb";
import TaskBox from "@/models/taskbox-schema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import User from "@/models/user-schema";
import { resolve } from "path";

export async function POST(request: NextRequest){

  const { dateStart, title, date, start, end, image, color, daysLeft, user } = await request.json();
  console.log('Incoming task data:', { dateStart, title, date, start, end, image, color, daysLeft, user });

  await connectMongoDB();
  // Check if user exists in database using email or user ID
  const userRecord = await User.findOne({ email: user }); // Assuming you pass email in the request
  if (!userRecord) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const userId = userRecord._id;  // MongoDB ObjectId of user
  console.log("User Id: ", userId);
  
  
  // Create todays plan with MongoDB ObjectId
  await TaskBox.create({
    user: userId, 
    title,
    date,
    start,
    end,
    image,
    color,
    daysLeft
  });

  return NextResponse.json({ message: "Entry added successfully!" }, { status: 201 }); 
}

export async function GET() {
    await connectMongoDB();
    const tasks = await TaskBox.find();
    if (Array.isArray(tasks) && tasks.length > 0) {
      return NextResponse.json({ tasks });  // Return tasks in an object with the key 'tasks'
    } else {
      return NextResponse.json({ tasks: [] });  // If no tasks are found, return an empty array
    }}