import { SignUpMethods } from "./SignUpMethods.enum";

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  signUpMethod: SignUpMethods;
  createdAt: string;
  updatedAt: string;
}
