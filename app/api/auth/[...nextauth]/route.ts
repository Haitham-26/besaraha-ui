import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "google" && account.id_token) {
        try {
          const res = await fetch(`${process.env.API_URL}/auth/google-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: account.id_token }),
          });

          if (!res.ok) {
            return false;
          }

          const { token } = await res.json();

          const cookieStore = await cookies();

          cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        } catch (e) {
          console.error("Backend Google login failed:", e);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, account }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }

      return token;
    },

    async session({ session, token }) {
      session.idToken = token.idToken;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
