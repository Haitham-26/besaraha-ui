import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { User } from "@/model/user/User";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "login",
      name: "login",
      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${process.env.API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials.identifier,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            const errBody = await res.json();

            throw new Error(errBody.message || "Invalid credentials");
          }

          const data = await res.json();

          const cookieStore = await cookies();

          cookieStore.set("token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });

          return {
            user: data.user,
            id: data.user._id,
          };
        } catch (e: any) {
          console.log("Backend credentials login failed:", e);
          throw new Error(e.message || "Invalid credentials");
        }
      },
    }),
    CredentialsProvider({
      id: "signup-token",
      name: "signup-token",
      credentials: {
        token: { label: "Token", type: "text" },
        email: { label: "Email", type: "text" },
        lang: { label: "Lang", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.token || !credentials?.email) {
          return null;
        }

        try {
          const res = await fetch(`${process.env.API_URL}/auth/signup/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: credentials.token,
              email: credentials.email,
              lang: credentials.lang,
            }),
          });

          if (!res.ok) {
            const errBody = await res.json();

            throw new Error(errBody.message || "Invalid token");
          }

          const data = await res.json();

          const cookieStore = await cookies();

          cookieStore.set("token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });

          return {
            user: data.user,
            id: data.user._id,
          };
        } catch (e: any) {
          console.log("Backend token signup login failed:", e);
          throw new Error(e.message || "Invalid token");
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ account, user }) {
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

          const data = await res.json();

          const cookieStore = await cookies();

          cookieStore.set("token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });

          (user as any).id = data.user._id;
          (user as any).user = data.user;
        } catch (e) {
          console.error("Google login failed:", e);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, account, user }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }

      if (user) {
        token.user = (user as any).user as User;
      }

      return token;
    },

    async session({ session, token }) {
      session.idToken = token.idToken as string | undefined;

      if (session.user) {
        session.user = token.user;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
