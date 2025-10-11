import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create a JWT token for API authentication
    const token = jwt.sign(
      {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        first_name: session.user.first_name,
        last_name: session.user.last_name,
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '15m' },
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
