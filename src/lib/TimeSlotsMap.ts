import { slotDuration, Event, COACHES } from "../constants/data";
import { BUSY_LEVELS, LessonType } from "../models";
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

    while (time + duration <= bounds[1]) {
      timeSlotsMap[time] = new TimeSlot(time, duration, this);
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

  getTimeSlot(time: number): TimeSlot | undefined {
    return this.timeSlots[time];
  }

  getNextTimeSlot(current: number): TimeSlot | undefined {
    return this.getTimeSlot(current + slotDuration);
  }

  getPrevTimeSlot(current: number): TimeSlot | undefined {
    return this.getTimeSlot(current - slotDuration);
  }

  getAvailableTimeSlots(lessonType: LessonType): TimeSlot[] {
    const timeSlots: TimeSlot[] = [];

    const coaches: COACHES[] = lessonType.coaches.map(
      (coach) => coach.name as COACHES
    );
    const isFloating = lessonType.coaches.length > 1;
    const isHalfTime = lessonType.coachBusyLevel === BUSY_LEVELS.HALF;

    for (const timeSlot of Object.values(this.timeSlots)) {
      let isAvailable = true;

      if (isFloating) {
        isAvailable = timeSlot.getFloatingAvailability(coaches);
      }

      if (!isFloating && isHalfTime) {
        isAvailable = timeSlot.getHalfTimeAvailability(coaches);
      }

      if (!isFloating && !isHalfTime) {
        isAvailable = timeSlot.getFullTimeAvailability(coaches);
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
      const isHalfTime = event.isHalfTime;

      while (time < event.endTime) {
        const timeSlotsKeys = this._getMatchingTimeSlots(time);

        if (event.orderedCoaches && event.orderedCoaches.length > 0) {
          const index = (time - event.startTime) / slotDuration;
          const coach = event.orderedCoaches[index];

          timeSlotsKeys.forEach((key) => {
            this.getTimeSlot(key)?.addCoachBusiness(
              coach,
              !!isFloating,
              !!isHalfTime
            );
          });
        } else {
          for (const coach of event.coaches) {
            timeSlotsKeys.forEach((key) => {
              this.getTimeSlot(key)?.addCoachBusiness(
                coach,
                !!isFloating,
                !!isHalfTime
              );
            });
          }
        }

        time += slotDuration;
      }
    }
  }
}
