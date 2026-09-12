import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { User } from "@/model/user/types/User";
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
            const errBody = await res.json().catch(() => null);
            const message = errBody?.message || "حدث خطأ أثناء تسجيل الدخول";

            const cookieStore = await cookies();
            const callbackUrlCookie =
              cookieStore.get("next-auth.callback-url")?.value ??
              cookieStore.get("__Secure-next-auth.callback-url")?.value ??
              "/";

            const url = new URL(callbackUrlCookie, process.env.NEXTAUTH_URL);
            url.searchParams.set("authError", message);

            return url.toString();
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

          const cookieStore = await cookies();
          const callbackUrlCookie =
            cookieStore.get("next-auth.callback-url")?.value ?? "/";

          const url = new URL(callbackUrlCookie, process.env.NEXTAUTH_URL);
          url.searchParams.set("authError", "حدث خطأ أثناء تسجيل الدخول");

          return url.toString();
        }
      }

      return true;
    },
    async jwt({ token, account, user, trigger, session }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }

      if (user) {
        token.user = (user as any).user as User;
      }

      if (trigger === "update" && session?.user) {
        token.user = { ...token.user, ...session.user };
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
