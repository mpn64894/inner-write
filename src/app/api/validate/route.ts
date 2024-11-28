import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersInstance = headers();
    const authHeader = (await headersInstance).get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload | string;

    // Check if the decoded token is an object with an `exp` property
    if (typeof decoded !== 'string' && decoded?.exp) {
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        return NextResponse.json(
          { message: 'Expired token. Please log in again.', removeToken: true },
          { status: 400 }
        );
      } else {
        // If the token is valid, return some protected data.
        return NextResponse.json({ data: 'Protected data' }, { status: 200 });
      }
    } else {
      return NextResponse.json({ message: 'Invalid token payload' }, { status: 400 });
    }
  } catch (error) {
    console.error('Token verification failed', error);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 400 });
  }
}
