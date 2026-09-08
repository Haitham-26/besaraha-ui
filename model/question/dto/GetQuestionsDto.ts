import { GenericSortType } from "@/model/shared/dto/GenericSortType";

export interface GetQuestionsDto {
  sort?: GenericSortType;
  isPublic?: boolean;
}
