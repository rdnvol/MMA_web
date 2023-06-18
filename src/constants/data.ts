import { addDays, format, isEqual, parse, parseISO } from "date-fns";
import {
  BUSY_LEVELS,
  Coach,
  Lesson,
  LessonType,
  LESSON_TYPES,
} from "../models";
import {
  minutesToTime,
  timeToMinutes,
  mergeDateAndMinutes,
} from "../utils/calendar";

export const DATE_FORMAT = "yyyy-MM-dd";
export const TIME_FORMAT = "H:mm";
export const today = new Date();
export const slotDuration = 30;
export const dailyBounds: [number, number] = [
  timeToMinutes("8:00"),
  timeToMinutes("21:00"),
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

export type Event = {
  id: number;
  date: Date;
  startTime: number;
  endTime: number;
  coaches: Coach[];
  lessonType: LessonType;
  label: string;
  isFloating?: boolean;
  isHalfTime?: boolean;
  coachOrder?: number[];
};

export type EventsLine = Event[];

export type Position = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type PositionedEvent = Event & { position: Position };

export const coachesData: Coach[] = [
  { id: 1, email: "sasha@mma-app.com", name: "Sasha" },
  { id: 2, email: "vika@mma-app.com", name: "Vika" },
];

export function getDateRange(start?: string, end?: string): Date[] {
  if (!start || !end) {
    return [];
  }

  const dateRange: Date[] = [];

  const startDate = parse(start, DATE_FORMAT, new Date());
  const endDate = parse(end, DATE_FORMAT, new Date());

  let current = startDate;

  while (!isEqual(current, endDate)) {
    dateRange.push(current);
    current = addDays(current, 1);
  }

  dateRange.push(current);

  return dateRange;
}

export function dumpLessonToEvent(lesson: Lesson): Event {
  const startDate = new Date(lesson.startDate);
  const endDate = new Date(lesson.endDate);

  const startTime = format(startDate, TIME_FORMAT);
  const endTime = format(endDate, TIME_FORMAT);

  startDate.setHours(0, 0, 0, 0);

  return {
    id: lesson.id,
    date: startDate,
    startTime: timeToMinutes(startTime),
    endTime: timeToMinutes(endTime),
    coaches: lesson.lessonType.coaches,
    label: lesson.name || lesson.participants?.map((p) => p.name).join(" + "),
    lessonType: lesson.lessonType,
    isFloating:
      lesson.lessonType.type !== LESSON_TYPES.Other &&
      lesson.lessonType.coaches.length > 1 &&
      !lesson.coachOrder?.length,
    isHalfTime: lesson.lessonType.coachBusyLevel === BUSY_LEVELS.Half,
    coachOrder: lesson.coachOrder,
  };
}

export function dumpEventToLesson(event: Event): Lesson {
  const startDate = mergeDateAndMinutes(event.date, event.startTime);
  const endDate = mergeDateAndMinutes(event.date, event.endTime);

  return {
    id: event.id,
    name: event.label,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    participants: [],
    lessonType: event.lessonType,
    coachOrder: [],
  };
}

export function getEventByLessonId(
  lessonId: number,
  lessons: Lesson[]
): Event | undefined {
  const lesson = lessons.find((l) => l.id === lessonId);

  return lesson ? dumpLessonToEvent(lesson) : undefined;
}

export function getEventsByDateFromLessons(
  date: Date,
  lessons: Record<string, Lesson[]>
) {
  const formattedDate = format(date, DATE_FORMAT);

  return (lessons[formattedDate] || []).map(dumpLessonToEvent);
}

export function groupLessonsByDate(
  lessons: Lesson[]
): Record<string, Lesson[]> {
  const groupedLessons: Record<string, Lesson[]> = {};

  for (const lesson of lessons) {
    const date = format(parseISO(lesson.startDate), DATE_FORMAT);

    if (!(date in groupedLessons)) {
      groupedLessons[date] = [];
    }

    groupedLessons[date].push(lesson);
  }

  return groupedLessons;
}
