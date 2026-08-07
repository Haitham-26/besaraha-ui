import { PageMeta } from "./PageMeta";

export interface DataWithMeta<T = any> {
  data: T[];
  meta: PageMeta;
}
