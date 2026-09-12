import { User } from "../user/types/User";

export interface GetMessageRecipientProfileResponseDto {
  name: User["name"];
  username: User["username"];
  avatar?: User["avatar"];
}
