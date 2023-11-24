import { getRequest} from "@/services/request";

export const getArticleList = (params: any) => {
  return getRequest("/api/article/list", params);
};
