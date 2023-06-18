import { COACHES } from "../constants/data";
import TimeSlotsMap from "./TimeSlotsMap";

export default class TimeSlot {
  constructor(
    public startTime: number,
    public duration: number,
    private parent: TimeSlotsMap,
    public isFloating?: boolean,
    private coachToBusiness: Record<string, number> = {}
  ) {}

  addCoachBusiness(
    coach: COACHES,
    isFloating: boolean,
    isHalfTime: boolean
  ): void {
    if (this.isFloating === undefined) {
      this.isFloating = isFloating;
    } else if (this.isFloating !== isFloating) {
      throw new Error("INCONSISTENT_DATA");
    }

    let business = isHalfTime || isFloating ? 0.5 : 1;

    if (!this.coachToBusiness[coach]) {
      this.coachToBusiness[coach] = 0;
    }

    this.coachToBusiness[coach] += business;
  }

  getCoachBusiness(coach: COACHES) {
    return this.coachToBusiness[coach];
  }

  getFloatingAvailability(coaches: COACHES[]): boolean {
    const prev = this.parent.getPrevTimeSlot(this.startTime);
    const next = this.parent.getNextTimeSlot(this.startTime);

    if (coaches.some((coach: COACHES) => this.getCoachBusiness(coach) >= 1.5)) {
      return false;
    }

    if (
      coaches.every((coach: COACHES) => {
        if (prev && !prev.isFloating && prev.getCoachBusiness(coach) > 1) {
          return true;
        }

        if (next && !next.isFloating && next.getCoachBusiness(coach) > 1) {
          return true;
        }

        return false;
      })
    ) {
      return false;
    }

    return true;
  }

  getHalfTimeAvailability(coaches: COACHES[]): boolean {
    const prev = this.parent.getPrevTimeSlot(this.startTime);
    const next = this.parent.getNextTimeSlot(this.startTime);

    if (
      this.isFloating &&
      coaches.some((coach: COACHES) => this.getCoachBusiness(coach) >= 1.5)
    ) {
      return false;
    }

    if (
      !this.isFloating &&
      coaches.some((coach: COACHES) => this.getCoachBusiness(coach) >= 1.5)
    ) {
      return false;
    }

    if (
      coaches.some((coach: COACHES) => {
        if (prev && prev.getCoachBusiness(coach) >= 2) {
          return true;
        }
        if (next && next.getCoachBusiness(coach) >= 2) {
          return true;
        }

        return false;
      })
    ) {
      return false;
    }

    return true;
  }

  getFullTimeAvailability(coaches: COACHES[]): boolean {
    const prev = this.parent.getPrevTimeSlot(this.startTime);
    const next = this.parent.getNextTimeSlot(this.startTime);

    if (coaches.some((coach: COACHES) => this.getCoachBusiness(coach) >= 1)) {
      return false;
    }

    if (
      coaches.some((coach: COACHES) => {
        if (prev && !prev.isFloating && prev.getCoachBusiness(coach) >= 1.5) {
          return true;
        }
        if (next && !next.isFloating && next.getCoachBusiness(coach) >= 1.5) {
          return true;
        }

        return false;
      })
    ) {
      return false;
    }

    return true;
  }
}
