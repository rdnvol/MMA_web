import { COACHES } from "../constants/data";
import { LESSON_TYPES } from "../models";

export default class TimeSlot {
  constructor(
    public startTime: number,
    public duration: number,
    public isFloating?: boolean,
    private coachToBusiness: Record<string, number> = {}
  ) {}

  addCoachBusiness(
    coach: COACHES,
    lessonType: LESSON_TYPES,
    isFloating: boolean
  ): void {
    if (this.isFloating === undefined) {
      this.isFloating = isFloating;
    } else if (this.isFloating !== isFloating) {
      throw new Error("INCONSISTENT_DATA");
    }

    let business: number =
      lessonType === LESSON_TYPES.SPLIT || isFloating ? 0.5 : 1;

    if (!this.coachToBusiness[coach]) {
      this.coachToBusiness[coach] = 0;
    }

    this.coachToBusiness[coach] += business;
  }

  getCoachBusiness(coach: COACHES) {
    return this.coachToBusiness[coach];
  }
}
