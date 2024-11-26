import connectMongoDB from "@/libs/mongodb";
import TodaysPlan from "@/models/todays-plan-schema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

interface RouteParams {
    params: {id: string};
}

export async function GET(request:NextRequest, {params}: RouteParams) {
    const {id} = params;
    await connectMongoDB();
    const entry = await TodaysPlan.findOne({ _id: id});
    return NextResponse.json({entry}, {status: 200});
}

//update specific item
export async function PUT(request:NextRequest,{params}: RouteParams ) {
    const { id } = await params;
    const {selectedHour: selectedHour, task: task} = await request.json();
    await connectMongoDB();
    await TodaysPlan.findByIdAndUpdate(id, {selectedHour, task});
    return NextResponse.json({message: "Entry Updated"}, {status:200});
}

//delete item
export async function DELETE(request:NextRequest, {params}: RouteParams) {
    const { id } = await params;   
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({message: "Invalid ID format"}, {status : 400});
    }
    await connectMongoDB();
    const deletedItem = await TodaysPlan.findByIdAndDelete(id);
    if (!deletedItem) {
        return NextResponse.json({ message: "Entry not found"}, {status:404});
    }
    return NextResponse.json({ message: "Entry Deleted"}, {status: 200});
}