export enum LESSON_TYPES {
  PERSONAL = "personal",
  GROUP = "group",
  SPLIT = "split",
  MASSAGE = "massage",
}

export const TYPE_COLOR_MAP: Record<LESSON_TYPES, string> = {
  [LESSON_TYPES.PERSONAL]: "blue.200",
  [LESSON_TYPES.GROUP]: "green.200",
  [LESSON_TYPES.SPLIT]: "yellow.200",
  [LESSON_TYPES.MASSAGE]: "red.200",
};

export enum BUSY_LEVELS {
  FULL = 1,
  HALF = 0.5,
}

export interface Coach {
  id: string;
  email: string;
  name: string;
}

export interface LessonType {
  id: string;
  type: LESSON_TYPES;
  coaches: Coach[];
  coachBusyLevel: BUSY_LEVELS;
}

export interface Participant {
  id: string;
  email: string;
  name: string;
}

export interface Lesson {
  id: string;
  lessonType: LessonType;
  participants: Participant[];
  date: string;
  startTime: string;
  endTime: string;
}

export interface CalendarDay {
  id: "";
  date: "";
  lessons: Lesson[];
  dailyBounds: [number, number];
}
