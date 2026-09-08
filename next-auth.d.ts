import { DefaultSession } from "next-auth";
import { User } from "./model/user/User";

declare module "next-auth" {
  interface Session extends DefaultSession {
    idToken?: string;
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    user?: User;
  }
}
