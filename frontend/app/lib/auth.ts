import { cookies } from 'next/headers';

export async function getServerSession() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  if (!jwt) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/check`,
      {
        headers: {
          Cookie: `jwt=${jwt}`,
        },
      }
    );

    if (!response.ok) return null;

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}
