import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { time } from 'console';
import User from '@/models/user-schema';
import bcrypt from 'bcryptjs';
// authenticate with mongodb and hceck if user in db

export async function authenticateUser(email: string, password: string) {
  const user = await User.findOne({ email });

  if (!user) {
    return null; // No user found
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    return { userId: user.email }; // Return userId if the password is valid
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, password } = body
 
  // Perform user authentication here against your database or authentication service
  const user = await authenticateUser(email, password)
  // userID when we get a db set up

  let token = null;
  if (user){
      token = jwt.sign({ userId: user?.userId }, process.env.JWT_SECRET as string, {
      expiresIn: '2h',
    })
  } 
  console.log("users: " + user)
  if (!user) {
    // Authentication failed, send a failure response
    return NextResponse.json(
      { message: "Invalid email or password" }, 
      { status: 401 } // Unauthorized status code
    )
  }
  return NextResponse.json({ token })
}
