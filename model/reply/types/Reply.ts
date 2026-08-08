export interface Reply {
  _id: string;
  name?: string;
  reply: string;
  questionId: string;
  likesCount: number;
  likedBy: string[];
  hasLiked: boolean;
  createdAt: string;
  updatedAt: string;
}
