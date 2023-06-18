import {
  BUSY_LEVELS,
  Coach,
  Lesson,
  LessonType,
  LESSON_TYPES,
} from "../models";
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

export enum COACHES {
  Vika = "Vika",
  Sasha = "Sasha",
  Empty = "",
}

export const coachesData: Coach[] = [
  { id: "sasha", email: "sasha@mma-app.com", name: "Sasha" },
  { id: "vika", email: "vika@mma-app.com", name: "Vika" },
];

export const lessonTypesData: LessonType[] = [
  {
    id: "personal-sasha",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  },
  {
    id: "group-sasha",
    type: LESSON_TYPES.GROUP,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  },
  {
    id: "split-sasha",
    type: LESSON_TYPES.SPLIT,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.HALF,
  },
  {
    id: "personal-vika",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  },
  {
    id: "group-vika",
    type: LESSON_TYPES.GROUP,
    coaches: [coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  },
  {
    id: "split-vika",
    type: LESSON_TYPES.SPLIT,
    coaches: [coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.HALF,
  },
  {
    id: "personal-sasha-vika",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  },
  {
    id: "group-sasha-vika",
    type: LESSON_TYPES.GROUP,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  },
  {
    id: "split-sasha-vika",
    type: LESSON_TYPES.SPLIT,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.HALF,
  },
];

export type Event = {
  id: string;
  startTime: number;
  endTime: number;
  coaches: COACHES[];
  lessonType?: LESSON_TYPES;
};

export type EventsLine = Event[];

export type Position = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type PositionedEvent = Event & { position: Position };

export const calendarData: Record<string, Lesson[]> = {
  Mon: [
    {
      id: "mon-1",
      lessonType: lessonTypesData[3],
      participants: [],
      date: "2023-02-27",
      startTime: "8:30",
      endTime: "9:00",
    },
    {
      id: "mon-2",
      lessonType: lessonTypesData[0],
      participants: [],
      date: "2023-02-27",
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      id: "mon-3",
      lessonType: lessonTypesData[6],
      participants: [],
      date: "2023-02-27",
      startTime: "11:30",
      endTime: "13:00",
    },
  ],
  Tue: [
    {
      id: "tue-1",
      lessonType: lessonTypesData[3],
      participants: [],
      date: "2023-02-28",
      startTime: "8:30",
      endTime: "9:00",
    },
    {
      id: "tue-2",
      lessonType: lessonTypesData[3],
      participants: [],
      date: "2023-02-28",
      startTime: "10:30",
      endTime: "11:30",
    },
    {
      id: "tue-3",
      lessonType: lessonTypesData[0],
      participants: [],
      date: "2023-02-28",
      startTime: "11:00",
      endTime: "12:00",
    },
    {
      id: "tue-4",
      lessonType: lessonTypesData[3],
      participants: [],
      date: "2023-02-28",
      startTime: "11:30",
      endTime: "13:00",
    },
  ],
  Wed: [
    {
      id: "wed-1",
      lessonType: lessonTypesData[2],
      participants: [],
      date: "2023-03-01",
      startTime: "8:30",
      endTime: "9:30",
    },
    {
      id: "wed-2",
      lessonType: lessonTypesData[8],
      participants: [],
      date: "2023-03-01",
      startTime: "9:00",
      endTime: "10:00",
    },
    {
      id: "wed-3",
      lessonType: lessonTypesData[3],
      participants: [],
      date: "2023-03-01",
      startTime: "8:00",
      endTime: "9:00",
    },
    {
      id: "wed-4",
      lessonType: lessonTypesData[5],
      participants: [],
      date: "2023-03-01",
      startTime: "9:00",
      endTime: "10:00",
    },
    {
      id: "wed-5",
      lessonType: lessonTypesData[2],
      participants: [],
      date: "2023-03-01",
      startTime: "9:30",
      endTime: "10:30",
    },
  ],
};

function dumpLessonToEvent(lesson: Lesson): Event {
  return {
    id: lesson.id,
    startTime: timeToMinutes(lesson.startTime),
    endTime: timeToMinutes(lesson.endTime),
    coaches: lesson.lessonType.coaches.map((coach) => coach.name as COACHES),
    lessonType: lesson.lessonType.type,
  };
}

export const events: Record<string, Event[]> = {
  Mon: calendarData.Mon.map(dumpLessonToEvent),
  Tue: calendarData.Tue.map(dumpLessonToEvent),
  Wed: calendarData.Wed.map(dumpLessonToEvent),
};
