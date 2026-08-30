import { PageMeta } from "@/model/shared/types/PageMeta";
import { Question } from "../Question";

export interface GetQuestionsResponseDto {
  data: Question[];
  meta: PageMeta;
}
