import { slotDuration, Event, COACHES } from "../constants/data";
import { LessonType } from "../models";
import TimeSlot from "./TimeSlot";

export default class TimeSlotsMap {
  public timeSlots: Record<number, TimeSlot>;
  private duration: number;
  private dailyBounds: [number, number];

  constructor(duration: number, dailyBounds: [number, number]) {
    this.duration = duration;
    this.dailyBounds = dailyBounds;

    this.timeSlots = this._createTimeSlotsMap(this.duration, this.dailyBounds);
  }

  _createTimeSlotsMap(
    duration: number,
    bounds: [number, number]
  ): Record<number, TimeSlot> {
    const timeSlotsMap: Record<number, TimeSlot> = {};

    let time = bounds[0];

    while (time < bounds[1]) {
      timeSlotsMap[time] = new TimeSlot(time, duration);
      time += slotDuration;
    }

    return timeSlotsMap;
  }

  _getMatchingTimeSlots(startTime: number): number[] {
    let offset = 0;
    const timeSlots: number[] = [];

    while (offset < this.duration / slotDuration) {
      if (startTime - offset * slotDuration >= this.dailyBounds[0]) {
        timeSlots.push(startTime - offset * slotDuration);
      }
      offset += 1;
    }

    return timeSlots;
  }

  _getTimeSlot(time: number): TimeSlot | undefined {
    return this.timeSlots[time];
  }

  _getNextTimeSlot(current: number): TimeSlot | undefined {
    return this._getTimeSlot(current + slotDuration);
  }

  _getPrevTimeSlot(current: number): TimeSlot | undefined {
    return this._getTimeSlot(current - slotDuration);
  }

  getAvailableTimeSlots(lessonType: LessonType): TimeSlot[] {
    const timeSlots: TimeSlot[] = [];

    const coaches: COACHES[] = lessonType.coaches.map(
      (coach) => coach.name as COACHES
    );
    const isFloating = lessonType.coaches.length > 1;

    for (const timeSlot of Object.values(this.timeSlots)) {
      const time = timeSlot.startTime;
      let isAvailable = true;

      if (
        isFloating &&
        (coaches.some(
          (coach: COACHES) => timeSlot.getCoachBusiness(coach) >= 2
        ) ||
          coaches.every((coach: COACHES) => {
            const prev = this._getPrevTimeSlot(time);

            if (prev && prev.getCoachBusiness(coach) > 1) {
              return true;
            }

            const next = this._getNextTimeSlot(time);

            if (next && next.getCoachBusiness(coach) > 1) {
              return true;
            }

            return false;
          }))
      ) {
        isAvailable = false;
      }

      if (
        !isFloating &&
        coaches.some((coach: COACHES) => timeSlot.getCoachBusiness(coach) >= 1)
      ) {
        isAvailable = false;
      }

      if (isAvailable) {
        timeSlots.push(timeSlot);
      }
    }

    return timeSlots;
  }

  fillWithEvents(events: Event[]) {
    for (const event of events) {
      if (!event.lessonType) {
        continue;
      }

      let time = event.startTime;
      const isFloating = event.isFloating;
      const lessonType = event.lessonType;

      while (time < event.endTime) {
        const timeSlotsKeys = this._getMatchingTimeSlots(time);

        if (event.orderedCoaches && event.orderedCoaches.length > 0) {
          const index = (time - event.startTime) / slotDuration;
          const coach = event.orderedCoaches[index];

          timeSlotsKeys.forEach((key) => {
            this._getTimeSlot(key)?.addCoachBusiness(
              coach,
              lessonType,
              !!isFloating
            );
          });
        } else {
          for (const coach of event.coaches) {
            timeSlotsKeys.forEach((key) => {
              this._getTimeSlot(key)?.addCoachBusiness(
                coach,
                lessonType,
                !!isFloating
              );
            });
          }
        }

        time += slotDuration;
      }
    }
  }
}
