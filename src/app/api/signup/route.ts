// pages/api/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '@/models/user-schema';
import connectMongoDB from '@/libs/mongodb';

export async function POST(request: Request) {
    const { firstName, email, password } = await request.json();
  
    
    if (!firstName|| !email || !password) {
        return NextResponse.json(
            { message: 'All fields are required' },
            { status: 400 }
        );
    }
  
    // Connect to the database
    await connectMongoDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }
  
   
    
  
    // Create a new user
    const newUser = new User({
      firstName,
      email,
      password,
    });
  
    // Save the user to the database
    try {
      await newUser.save();
      return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error registering user' }, { status: 500 });
    }
  }