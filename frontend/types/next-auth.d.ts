import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      first_name: string;
      last_name: string;
      phone: string;
    } & DefaultSession['user'];
  }

  interface User {
    role?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    first_name: string;
    last_name: string;
    phone: string;
  }
}

declare module 'next-auth/providers/google' {
  interface Profile {
    given_name?: string;
    family_name?: string;
  }
}

declare module 'next-auth' {
  interface Profile {
    given_name?: string;
    family_name?: string;
  }
}
