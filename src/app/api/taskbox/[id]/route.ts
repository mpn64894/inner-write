import connectMongoDB from "@/libs/mongodb";
import TaskBox from "@/models/taskbox-schema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import User, { IUser } from "@/models/user-schema";
import jwt from "jsonwebtoken";

interface RouteParams {
    params: {id: string};
}

export async function GET(request:NextRequest, {params}: RouteParams) {
    const {id} = await params;
    await connectMongoDB();
    const user = await User.findOne({ email: id}) as IUser;
    const userId = user._id;
    return NextResponse.json({userId}, {status: 200});
}

//update specific item
export async function PUT(request: NextRequest, {params}: RouteParams ) {
    const { id } = await params;
    const {dateStart: dateStart, title: title, date: date, start: start, end: end, image: image, color: color, daysLeft: daysLeft} = await request.json();
    await connectMongoDB();
    await TaskBox.findByIdAndUpdate(id, {dateStart,title, date, start, end, image, color, daysLeft});
    return NextResponse.json({message: "Entry Updated"}, {status:200});
}

// Edit task
export async function PATCH(request: NextRequest, {params}: RouteParams) {
    const { id } = params;  // Get task ID from URL params
    const updatedData = await request.json();  // Get the updated task data from the request body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    await connectMongoDB();

    // Find and update the task by ID
    const updatedTask = await TaskBox.findByIdAndUpdate(
        id,
        { $set: updatedData }, // Only update the fields that were provided
        { new: true }  // Return the updated task
    );

    if (!updatedTask) {
        return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask, { status: 200 });
}

//delete item
export async function DELETE(request:NextRequest, {params}: RouteParams){
    const { id } = await params;   
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({message: "Invalid ID format"}, {status : 400});
    }
    await connectMongoDB();
    const deletedItem = await TaskBox.findByIdAndDelete(id);
    if (!deletedItem) {
        return NextResponse.json({ message: "Entry not found"}, {status:404});
    }
    return NextResponse.json({ message: "Entry Deleted"}, {status: 200});
}