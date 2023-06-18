import { CreateLessonDto } from "../types/api-types";
import BaseAPI from "./BaseAPI";

class LessonsAPI extends BaseAPI {
  async create(params: CreateLessonDto): Promise<void> {
    return this.apiClient.post("lessons", params);
  }

  async delete(lessonId: number): Promise<void> {
    return this.apiClient.delete(`lessons/${lessonId}`);
  }
}

export default LessonsAPI;
