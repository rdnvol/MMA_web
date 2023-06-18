import ApiClient from "./ApiClient";
import LessonsAPI from "./LessonsAPI";

export interface API {
  apiClient: ApiClient;
  lessons: LessonsAPI;
}

export default function createAPI({ baseUrl }: { baseUrl: string }): API {
  const apiClient = new ApiClient(baseUrl);

  return {
    apiClient,
    lessons: new LessonsAPI({ apiClient }),
  };
}
