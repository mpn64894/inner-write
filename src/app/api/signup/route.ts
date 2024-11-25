import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user-schema";
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST (request: NextRequest) {
    const {firstName, email, password} = await request.json();
    await connectMongoDB();
    const hashedPassword = await bcrypt.hash (password, 5);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({message: "User already exists" },{ status: 400},);
    }

    const newUser = {
        firstName,
        email,
        password: hashedPassword,
    }

    try {
        await User.create(newUser);
    } catch (error) {
        console.log(error);
    }
}