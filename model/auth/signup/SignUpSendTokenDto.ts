import { AppDirections } from "@/model/shared/types/AppDirections.enum";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";

export interface SignUpSendTokenDto {
  email: string;
  lang: AppLangs;
  dir: AppDirections;
}
