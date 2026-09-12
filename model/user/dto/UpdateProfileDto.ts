import { User } from "../types/User";

export interface UpdateProfileDto {
  name?: User["name"];
  username?: User["username"];
}
