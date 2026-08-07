import { AppLangs } from "@/model/shared/types/AppLangs.enum";
import { SignUpEmailDto } from "./SignUpEmailDto";

export interface SignUpVerifyTokenDto extends SignUpEmailDto {
  token: string;
  lang: AppLangs;
}
