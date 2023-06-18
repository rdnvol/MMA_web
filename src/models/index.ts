export enum LESSON_TYPES {
  PERSONAL = "personal",
  GROUP = "group",
  SPLIT = "split",
  MASSAGE = "massage",
  OTHER = "other",
}

export enum BUSY_LEVELS {
  FULL = "full",
  HALF = "half",
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
  label?: string;
  lessonType: LessonType;
  participants: Participant[];
  date: string;
  startTime: string;
  endTime: string;
  orderedCoaches?: Coach[];
}

export interface CalendarDay {
  id: "";
  date: "";
  lessons: Lesson[];
  dailyBounds: [number, number];
}
