import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

// authenticate with mongodb and hceck if user in db
async function authenticateUser(email: string, password: string) {
  let db = null


  // Dummy user data
const dummyUser = {
  email: 'test@gmail.com',
  password: '123', // You can choose any password for testing
};

  // Check if the database instance has been initialized
  if (!db) {
  }
  if (email === dummyUser.email && password === dummyUser.password) {
    console.log("AUTH RAN")
    return { userId: dummyUser.email }; // Use email as user ID
  }
  return null; // Return null if authentication fails
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, password } = body

  // Perform user authentication here against your database or authentication service
  const user = await authenticateUser(email, password)
  // userID when we get a db set up
  const token = jwt.sign({ userId: user?.userId }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  })
  return NextResponse.json({ token })
}