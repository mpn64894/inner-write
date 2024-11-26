import connectMongoDB from "@/libs/mongodb";
import JournalEntry from "@/models/journal-entry-schema";
import User, { IUser } from "@/models/user-schema";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  await connectMongoDB();

  const { id } = await params; 
  if (!id) {
    return NextResponse.json({ error: "User email is required" }, { status: 400 });
  }

  const user = await User.findOne({ email: id }) as IUser;
  const userId = user._id;
  return NextResponse.json({userId}, {status:200});
}
