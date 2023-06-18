import { format, parse } from "date-fns";
import {
  BUSY_LEVELS,
  Coach,
  Lesson,
  LessonType,
  LESSON_TYPES,
  Participant,
} from "../models";
import {
  minutesToTime,
  timeToMinutes,
  getCurrentWeek,
} from "../utils/calendar";

export const DATE_FORMAT = "yyyy-MM-dd";
export const today = new Date();
export const currentWeek = getCurrentWeek(today);
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

export type Event = {
  id: string;
  date: Date;
  startTime: number;
  endTime: number;
  coaches: COACHES[];
  lessonType?: LESSON_TYPES;
  label?: string;
  isFloating?: boolean;
  orderedCoaches?: COACHES[];
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

  // Other
  {
    id: "other-sasha",
    type: LESSON_TYPES.OTHER,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  },
  {
    id: "other-vika",
    type: LESSON_TYPES.OTHER,
    coaches: [coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  },
  {
    id: "other-sasha-vika",
    type: LESSON_TYPES.OTHER,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  },

  // Massage
  {
    id: "massage-sasha",
    type: LESSON_TYPES.MASSAGE,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  },
  {
    id: "massage-vika",
    type: LESSON_TYPES.MASSAGE,
    coaches: [coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  },
];

const participantsData: Participant[] = [
  {
    id: "participant-1",
    email: "vira@mma-app.com",
    name: "Віра",
  },
  {
    id: "participant-2",
    email: "karim@mma-app.com",
    name: "Карім",
  },
  {
    id: "participant-3",
    email: "olia@mma-app.com",
    name: "Оля",
  },
  {
    id: "participant-4",
    email: "sasha@mma-app.com",
    name: "Саша",
  },
  {
    id: "participant-5",
    email: "ulia@mma-app.com",
    name: "Юля",
  },
  {
    id: "participant-6",
    email: "anton@mma-app.com",
    name: "Антон",
  },
  {
    id: "participant-7",
    email: "weekend@mma-app.com",
    name: "Вихідний",
  },
];

const lessonsData: Lesson[] = [
  {
    id: "sun-1",
    lessonType: lessonTypesData[11],
    participants: [participantsData[6]],
    date: format(currentWeek[0], DATE_FORMAT),
    startTime: "8:00",
    endTime: "18:00",
  },

  // {
  //   id: "mon-1",
  //   lessonType: lessonTypesData[3],
  //   participants: [participantsData[3]],
  //   date: format(currentWeek[1], DATE_FORMAT),
  //   startTime: "8:30",
  //   endTime: "9:00",
  // },
  // {
  //   id: "mon-2",
  //   lessonType: lessonTypesData[0],
  //   participants: [participantsData[2]],
  //   date: format(currentWeek[1], DATE_FORMAT),
  //   startTime: "10:00",
  //   endTime: "11:00",
  // },
  // {
  //   id: "mon-3",
  //   lessonType: lessonTypesData[6],
  //   participants: [participantsData[0], participantsData[1]],
  //   date: format(currentWeek[1], DATE_FORMAT),
  //   startTime: "11:30",
  //   endTime: "12:30",
  // },
  // {
  //   id: "mon-4",
  //   lessonType: lessonTypesData[6],
  //   participants: [participantsData[2], participantsData[3]],
  //   date: format(currentWeek[1], DATE_FORMAT),
  //   startTime: "12:00",
  //   endTime: "13:30",
  // },
  // {
  //   id: "mon-5",
  //   lessonType: lessonTypesData[6],
  //   participants: [participantsData[4]],
  //   date: format(currentWeek[1], DATE_FORMAT),
  //   startTime: "9:00",
  //   endTime: "10:00",
  //   // orderedCoaches: [coachesData[0], coachesData[1]],
  // },
  {
    id: "mon-6",
    lessonType: lessonTypesData[6],
    participants: [participantsData[4]],
    date: format(currentWeek[1], DATE_FORMAT),
    startTime: "9:00",
    endTime: "10:00",
  },
  {
    id: "tue-1",
    lessonType: lessonTypesData[3],
    participants: [participantsData[1]],
    date: format(currentWeek[2], DATE_FORMAT),
    startTime: "8:30",
    endTime: "9:00",
  },
  {
    id: "tue-2",
    lessonType: lessonTypesData[3],
    participants: [participantsData[0]],
    date: format(currentWeek[2], DATE_FORMAT),
    startTime: "10:30",
    endTime: "11:30",
  },
  {
    id: "tue-3",
    lessonType: lessonTypesData[0],
    participants: [participantsData[3]],
    date: format(currentWeek[2], DATE_FORMAT),
    startTime: "11:00",
    endTime: "12:00",
  },
  {
    id: "tue-4",
    lessonType: lessonTypesData[3],
    participants: [participantsData[2]],
    date: format(currentWeek[2], DATE_FORMAT),
    startTime: "11:30",
    endTime: "12:30",
  },
  {
    id: "wed-1",
    lessonType: lessonTypesData[2],
    participants: [participantsData[0], participantsData[1]],
    date: format(currentWeek[3], DATE_FORMAT),
    startTime: "8:30",
    endTime: "9:30",
  },
  {
    id: "wed-2",
    lessonType: lessonTypesData[8],
    participants: [participantsData[2], participantsData[3]],
    date: format(currentWeek[3], DATE_FORMAT),
    startTime: "9:00",
    endTime: "10:00",
  },
  {
    id: "wed-3",
    lessonType: lessonTypesData[3],
    participants: [participantsData[4]],
    date: format(currentWeek[3], DATE_FORMAT),
    startTime: "8:00",
    endTime: "9:00",
  },
  {
    id: "wed-4",
    lessonType: lessonTypesData[5],
    participants: [participantsData[4]],
    date: format(currentWeek[3], DATE_FORMAT),
    startTime: "9:00",
    endTime: "10:00",
  },
  {
    id: "wed-5",
    lessonType: lessonTypesData[2],
    participants: [participantsData[5]],
    date: format(currentWeek[3], DATE_FORMAT),
    startTime: "9:30",
    endTime: "10:30",
  },
  {
    id: "wed-6",
    lessonType: lessonTypesData[0],
    participants: [participantsData[0]],
    date: format(currentWeek[3], DATE_FORMAT),
    startTime: "8:00",
    endTime: "8:30",
  },
  {
    id: "wed-7",
    lessonType: lessonTypesData[3],
    participants: [participantsData[1]],
    date: format(currentWeek[3], DATE_FORMAT),
    startTime: "10:00",
    endTime: "10:30",
  },
  {
    id: "wed-8",
    lessonType: lessonTypesData[0],
    participants: [participantsData[3]],
    date: format(currentWeek[3], DATE_FORMAT),
    startTime: "10:30",
    endTime: "11:30",
  },
  {
    id: "wed-9",
    lessonType: lessonTypesData[5],
    participants: [participantsData[2]],
    date: format(currentWeek[3], DATE_FORMAT),
    startTime: "10:00",
    endTime: "11:30",
  },
  {
    id: "thu-1",
    lessonType: lessonTypesData[2],
    participants: [participantsData[5]],
    date: format(currentWeek[4], DATE_FORMAT),
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: "thu-2",
    lessonType: lessonTypesData[5],
    participants: [participantsData[4]],
    date: format(currentWeek[4], DATE_FORMAT),
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: "thu-3",
    lessonType: lessonTypesData[8],
    participants: [participantsData[3], participantsData[2]],
    date: format(currentWeek[4], DATE_FORMAT),
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: "thu-4",
    lessonType: lessonTypesData[2],
    participants: [participantsData[5]],
    date: format(currentWeek[4], DATE_FORMAT),
    startTime: "11:00",
    endTime: "12:00",
  },
  {
    id: "thu-5",
    lessonType: lessonTypesData[8],
    participants: [participantsData[3], participantsData[2]],
    date: format(currentWeek[4], DATE_FORMAT),
    startTime: "11:30",
    endTime: "12:30",
    orderedCoaches: [
      lessonTypesData[8].coaches[1],
      lessonTypesData[8].coaches[0],
    ],
  },
];

export const calendarData: Record<string, Lesson[]> =
  groupLessonsByDate(lessonsData);

function refreshCalendarData() {
  const calendar = groupLessonsByDate(lessonsData);

  for (const date of Object.keys(calendar)) {
    calendarData[date] = calendar[date];
  }
}

function getLessonsByDateTime(date: string, timeBounds: [number, number]) {
  const lessons = calendarData[date];

  return lessons
    .filter((lesson) => {
      const startTime = timeToMinutes(lesson.startTime);
      const endTime = timeToMinutes(lesson.endTime);

      if (
        (timeBounds[0] >= startTime && timeBounds[0] < endTime) ||
        (timeBounds[1] > startTime && timeBounds[1] <= endTime)
      ) {
        return true;
      }

      return false;
    })
    .map((lesson) => lesson.id);
}

export function dumpLessonToEvent(lesson: Lesson): Event {
  return {
    id: lesson.id,
    date: parse(lesson.date, DATE_FORMAT, new Date()),
    startTime: timeToMinutes(lesson.startTime),
    endTime: timeToMinutes(lesson.endTime),
    coaches: lesson.lessonType.coaches.map((coach) => coach.name as COACHES),
    label: lesson.label || lesson.participants.map((p) => p.name).join(" + "),
    lessonType: lesson.lessonType.type,
    isFloating:
      lesson.lessonType.coaches.length > 1 && !lesson.orderedCoaches?.length,
    orderedCoaches: lesson.orderedCoaches?.map(
      (coach) => coach.name as COACHES
    ),
  };
}

export function getEventsByDate(date: Date): Event[] {
  const formattedDate = format(date, DATE_FORMAT);

  return (calendarData[formattedDate] || []).map(dumpLessonToEvent);
}

export function addLesson(lesson: Lesson) {
  lessonsData.push(lesson);

  refreshCalendarData();
}

export function updateCoachesOrder(
  date: Date,
  coach: Coach,
  timeBounds: [number, number],
  lessonType: LESSON_TYPES,
  seen: Record<string, true> = {}
  // TODO: add transaction
) {
  const formattedDate = format(date, DATE_FORMAT);

  const lessonsIds = getLessonsByDateTime(formattedDate, timeBounds);

  for (const lessonId of lessonsIds) {
    if (lessonId in seen) {
      continue;
    }

    const lessonIndex = lessonsData.findIndex(
      (lesson) => lessonId === lesson.id
    );

    if (lessonIndex === -1) {
      continue;
    }

    seen[lessonId] = true;

    const lesson = lessonsData[lessonIndex];
    const coaches = lesson.lessonType.coaches;

    if (coaches.length === 1) {
      continue;
    }

    const anotherCoach = coaches.find((c) => c.id !== coach.id);

    if (!anotherCoach) {
      continue;
    }

    let time = timeToMinutes(lesson.startTime);
    lesson.orderedCoaches = [];

    while (time < timeToMinutes(lesson.endTime)) {
      if (time >= timeBounds[0] && time < timeBounds[1]) {
        updateCoachesOrder(
          date,
          anotherCoach,
          [time, time + slotDuration],
          lesson.lessonType.type,
          seen
        );
        lesson.orderedCoaches.push(anotherCoach);
      } else {
        updateCoachesOrder(
          date,
          coach,
          [time, time + slotDuration],
          lesson.lessonType.type,
          seen
        );
        lesson.orderedCoaches.push(coach);
      }
      time += slotDuration;
    }
  }

  refreshCalendarData();
}

function groupLessonsByDate(lessons: Lesson[]): Record<string, Lesson[]> {
  const map: Record<string, Lesson[]> = {};

  for (const lesson of lessons) {
    if (!(lesson.date in map)) {
      map[lesson.date] = [];
    }

    map[lesson.date].push(lesson);
  }

  return map;
}
