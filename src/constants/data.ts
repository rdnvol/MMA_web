import { minutesToTime, timeToMinutes } from "../utils/calendar";

export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const slotDuration = 30;
export const dailyBounds: [number, number] = [
  timeToMinutes("8:00"),
  timeToMinutes("18:00"),
];
export const slotsNumber = (dailyBounds[1] - dailyBounds[0]) / slotDuration;
export const timeData = Array.from({ length: slotsNumber }, (v, i) =>
  minutesToTime(i * slotDuration + dailyBounds[0])
);

export enum Coaches {
  Vika = "Vika",
  Sasha = "Sasha",
  Empty = "",
}

export type Event = {
  startTime: number;
  endTime: number;
  coach: Coaches;
};

export type EventsLine = Event[];

export type Position = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type PositionedEvent = Event & Position;

export const events: Record<string, Event[]> = {
  Mon: [
    {
      startTime: timeToMinutes("8:30"),
      endTime: timeToMinutes("9:00"),
      coach: Coaches.Vika,
    },
    {
      startTime: timeToMinutes("10:00"),
      endTime: timeToMinutes("11:00"),
      coach: Coaches.Sasha,
    },
    {
      startTime: timeToMinutes("11:30"),
      endTime: timeToMinutes("13:00"),
      coach: Coaches.Vika,
    },
  ],
  Tue: [
    {
      startTime: timeToMinutes("8:30"),
      endTime: timeToMinutes("9:00"),
      coach: Coaches.Vika,
    },
    {
      startTime: timeToMinutes("10:30"),
      endTime: timeToMinutes("11:30"),
      coach: Coaches.Vika,
    },
    {
      startTime: timeToMinutes("11:00"),
      endTime: timeToMinutes("12:00"),
      coach: Coaches.Sasha,
    },
    {
      startTime: timeToMinutes("11:30"),
      endTime: timeToMinutes("13:00"),
      coach: Coaches.Vika,
    },
  ],
};
