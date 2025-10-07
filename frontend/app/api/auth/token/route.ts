import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import jwt from 'jsonwebtoken';
import { authOptions } from '../[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create a JWT token for API calls using the user data
    const tokenData = {
      id: session.user.id,
      email: session.user.email,
      role: (session.user as any).role || 'user',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    };

    // Create JWT token using the same secret as the backend
    const token = jwt.sign(
      tokenData,
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
