import { addDays, getWeek, subDays } from "date-fns";
import { Event, PositionedEvent, slotDuration } from "../constants/data";
import TimeSlot from "../lib/TimeSlot";
import TimeSlotsMap from "../lib/TimeSlotsMap";
import { LessonType } from "../models";
import getMatrixFromEvents from "./matrix";

export type Calendar = Meeting[];
export type Meeting = [number, number];

export function getCurrentWeek(today: Date) {
  const week = getWeek(today);

  let currentWeek = [today];

  let minDayOfWeek = subDays(today, 1);
  let maxDayOfWeek = addDays(today, 1);

  while (week === getWeek(minDayOfWeek)) {
    currentWeek.unshift(minDayOfWeek);
    minDayOfWeek = subDays(minDayOfWeek, 1);
  }

  while (week === getWeek(maxDayOfWeek)) {
    currentWeek.push(maxDayOfWeek);
    maxDayOfWeek = addDays(maxDayOfWeek, 1);
  }

  return currentWeek;
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":");

  return +hours * 60 + +minutes;
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const min = minutes % 60;

  if (min < 10) {
    return `${hours}:0${min}`;
  }

  return `${hours}:${min}`;
}

export function mergeDateAndMinutes(date: Date, minutes: number): Date {
  const newDate = new Date(date);

  const hours = Math.floor(minutes / 60);
  const min = minutes % 60;

  newDate.setHours(hours, min, 0, 0);

  return newDate;
}

export function getPositionedEvents(
  events: Event[],
  dailyBounds: [number, number],
  slotDuration: number
): PositionedEvent[] {
  const positionsMatrix = getMatrixFromEvents(
    events,
    dailyBounds,
    slotDuration
  );

  return events.map((event: Event) => ({
    ...event,
    position: {
      x: positionsMatrix.get(event.id).x1 / positionsMatrix.matrixWidth,
      y: positionsMatrix.get(event.id).y1,
      w:
        (positionsMatrix.get(event.id).x2 -
          positionsMatrix.get(event.id).x1 +
          1) /
        positionsMatrix.matrixWidth,
      h:
        positionsMatrix.get(event.id).y2 - positionsMatrix.get(event.id).y1 + 1,
    },
  }));
}

export function getFreeSlots(
  events: Event[],
  lessonType: LessonType,
  duration: number,
  date: Date,
  dailyBounds: [number, number]
): PositionedEvent[] {
  const timeSlotsMap = new TimeSlotsMap(duration, dailyBounds);

  timeSlotsMap.fillWithEvents(events);

  const availableTimeSlots: TimeSlot[] =
    timeSlotsMap.getAvailableTimeSlots(lessonType);

  return availableTimeSlots.map((timeSlot: TimeSlot, index: number) => {
    const startTime = timeSlot.startTime;
    const endTime = timeSlot.startTime + timeSlot.duration;

    return {
      id: index,
      coaches: [],
      date,
      startTime,
      endTime,
      lessonType,
      label: "",
      position: {
        x: 0,
        y: (startTime - dailyBounds[0]) / slotDuration,
        w: 1,
        h: (endTime - startTime) / slotDuration,
      },
    };
  });
}
