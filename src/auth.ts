import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyPassword } from '@/lib/hash';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Fetch user from Supabase using the admin client (bypasses RLS)
        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', credentials.email as string)
          .single();

        if (error || !user) {
          return null;
        }

        // Verify password with our custom pepper + bcrypt logic
        const isValid = await verifyPassword(
          credentials.password as string,
          user.password_hash
        );
        
        if (!isValid) return null;

        // Return user object for NextAuth session
        return {
          id: user.id,
          email: user.email,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add the UUID from our database directly to the JWT token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the UUID to the edge/client
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
});
