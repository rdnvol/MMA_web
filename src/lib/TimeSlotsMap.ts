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

  _getMatchingTimeSlots(bounds: [number, number]): TimeSlot[] {
    const timeSlots: TimeSlot[] = [];

    const [startTime, endTime] = bounds;

    // start from last one time slot
    let timeSlot = this.getTimeSlot(endTime - slotDuration);

    while (!!timeSlot && timeSlot.startTime + timeSlot.duration > startTime) {
      timeSlots.push(timeSlot);
      timeSlot = this.getTimeSlot(timeSlot.startTime - slotDuration);
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
        isAvailable = timeSlot.isAvailableForFloating(coaches);
      }

      if (!isFloating && isHalfTime) {
        isAvailable = timeSlot.isAvailableForHalftime(coaches);
      }

      if (!isFloating && !isHalfTime) {
        isAvailable = timeSlot.isAvailableForFulltime(coaches);
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

      const timeSlots = this._getMatchingTimeSlots([
        event.startTime,
        event.endTime,
      ]);

      for (const timeSlot of timeSlots) {
        timeSlot.addEvent(event);
      }
    }
  }
}
