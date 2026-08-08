import { Reply } from "../reply/types/Reply";

export interface Question {
  _id: string;
  userId: string;
  question: string;
  replies: Reply[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
