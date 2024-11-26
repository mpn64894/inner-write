import connectMongoDB from "@/libs/mongodb";
import TaskBox from "@/models/taskbox-schema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

interface RouteParams {
    params: {id: string};
}

export async function GET(request:NextRequest, {params}: RouteParams) {
    const {id} = params;
    await connectMongoDB();
    const entry = await TaskBox.findOne({ _id: id});
    return NextResponse.json({entry}, {status: 200});
}

//update specific item
export async function PUT(request:NextRequest,{params}: RouteParams ) {
    const { id } = await params;
    const {dateStart: dateStart, title: title, date: date, start: start, end: end, image: image, color: color, daysLeft: daysLeft} = await request.json();
    await connectMongoDB();
    await TaskBox.findByIdAndUpdate(id, {dateStart,title, date, start, end, image, color, daysLeft});
    return NextResponse.json({message: "Entry Updated"}, {status:200});
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