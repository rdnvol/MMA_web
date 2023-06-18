import { expect, test } from "@jest/globals";
import {
  BUSY_LEVELS,
  Coach,
  Lesson,
  LessonType,
  LESSON_TYPES,
} from "../src/models";
import {
  Event,
  dumpLessonToEvent,
  coachesData,
  slotDuration,
  DATE_FORMAT,
} from "../src/constants/data";
import { getFreeSlots, Meeting, timeToMinutes } from "../src/utils/calendar";
import { format } from "date-fns";

const dailyBounds: [number, number] = [
  timeToMinutes("8:00"),
  timeToMinutes("11:00"),
];

const lessonDuration = 60;
const date = new Date();

function dumpEvent(event: Event): Meeting {
  return [event.startTime, event.endTime];
}

function generateSlotsBetween(
  ...bounds: [number | string, number | string][]
): Meeting[] {
  const slots: Meeting[] = [];

  for (const [start, end] of bounds) {
    const startTime = typeof start === "string" ? timeToMinutes(start) : start;
    const endTime = typeof end === "string" ? timeToMinutes(end) : end;
    let time = startTime;

    while (time + lessonDuration <= endTime) {
      slots.push([time, time + lessonDuration]);
      time += slotDuration;
    }
  }

  return slots;
}

function buildLesson(
  startTime: string,
  endTime: string,
  lessonType: LessonType,
  orderedCoaches?: Coach[]
): Lesson {
  return {
    id: "test-lesson",
    participants: [],
    date: format(date, DATE_FORMAT),
    startTime,
    endTime,
    lessonType,
    orderedCoaches,
  };
}

function assertFreeSlots(
  lessons: Lesson[],
  lessonType: LessonType,
  expectedSlots: Meeting[]
) {
  const events: Event[] = lessons.map(dumpLessonToEvent);

  const freeSlots = getFreeSlots(
    events,
    lessonType,
    lessonDuration,
    date,
    dailyBounds
  );

  const slots = freeSlots.map(dumpEvent);

  expect(slots).toEqual(expectedSlots);
}

test("Get free slots for 1st full-time lesson empty calendar", () => {
  const lessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };

  const lessons: Lesson[] = [];

  const expectedSlots = generateSlotsBetween(dailyBounds);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd full-time lesson (1st full-time, same coach)", () => {
  const lessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };

  const lessons: Lesson[] = [buildLesson("8:00", "9:00", lessonType)];

  const expectedSlots = generateSlotsBetween([
    lessons[0].endTime,
    dailyBounds[1],
  ]);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd full-time lesson (1st full-time, another coach)", () => {
  const lessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };
  const anotherLessonType = { ...lessonType, coaches: [coachesData[1]] };

  const lessons: Lesson[] = [buildLesson("8:00", "9:00", anotherLessonType)];

  const expectedSlots = generateSlotsBetween(dailyBounds);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd full-time floating lesson (1st full-time floating)", () => {
  const lessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };

  const lessons: Lesson[] = [buildLesson("8:00", "9:00", lessonType)];

  const expectedSlots = generateSlotsBetween(dailyBounds);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd half-time lesson (1st half-time, same coach)", () => {
  const lessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.SPLIT,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.HALF,
  };

  const lessons: Lesson[] = [buildLesson("8:00", "9:00", lessonType)];

  const expectedSlots = generateSlotsBetween(dailyBounds);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd full-time lesson (1st full-time floating)", () => {
  const lessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };
  const floatingLessonType = {
    ...lessonType,
    coaches: [coachesData[0], coachesData[1]],
  };

  const lessons: Lesson[] = [buildLesson("8:30", "9:30", floatingLessonType)];

  const expectedSlots = generateSlotsBetween(
    [dailyBounds[0], "9:00"],
    ["9:00", dailyBounds[1]]
  );

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd full-time floating lesson (1st full-time)", () => {
  const lessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };
  const floatingLessonType = {
    ...lessonType,
    coaches: [coachesData[0]],
  };

  const lessons: Lesson[] = [buildLesson("8:30", "9:30", floatingLessonType)];

  const expectedSlots = generateSlotsBetween(
    [dailyBounds[0], "9:00"],
    ["9:00", dailyBounds[1]]
  );

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 3rd full-time floating lesson (1st-2nd full-time floating)", () => {
  const lessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };

  const lessons: Lesson[] = [
    buildLesson("8:30", "9:30", lessonType),
    buildLesson("9:00", "10:00", lessonType),
  ];

  const expectedSlots = generateSlotsBetween(
    [dailyBounds[0], "9:00"],
    ["9:30", dailyBounds[1]]
  );

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 3rd half-time lesson (1st-2nd half-time, same coach)", () => {
  const lessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.SPLIT,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.HALF,
  };

  const lessons: Lesson[] = [
    buildLesson("8:30", "9:30", lessonType),
    buildLesson("9:00", "10:00", lessonType),
  ];

  const expectedSlots = generateSlotsBetween(
    [dailyBounds[0], lessons[1].startTime],
    [lessons[0].endTime, dailyBounds[1]]
  );

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 3rd full-time lesson (1st-2nd full-time floating)", () => {
  const floatingLessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };
  const lessonType: LessonType = {
    ...floatingLessonType,
    coaches: [coachesData[0]],
  };

  const lessons: Lesson[] = [
    buildLesson("8:30", "9:30", floatingLessonType),
    buildLesson("9:00", "10:00", floatingLessonType),
  ];

  const expectedSlots = generateSlotsBetween(
    [dailyBounds[0], "9:00"],
    ["9:30", dailyBounds[1]]
  );

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd full-time lesson (1st full-time ordered)", () => {
  const floatingLessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };
  const lessonType: LessonType = {
    ...floatingLessonType,
    coaches: [coachesData[0]],
  };

  const lessons: Lesson[] = [
    buildLesson("8:30", "9:30", floatingLessonType, [
      coachesData[0],
      coachesData[1],
    ]),
  ];

  const expectedSlots = generateSlotsBetween(["9:00", dailyBounds[1]]);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd full-time floating lesson (1st full-time ordered)", () => {
  const lessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };

  const lessons: Lesson[] = [
    buildLesson("8:30", "9:30", lessonType, [coachesData[0], coachesData[1]]),
  ];

  const expectedSlots = generateSlotsBetween(dailyBounds);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 3rd full-time lesson (1st-2nd half-time)", () => {
  const halftimeLessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.HALF,
  };
  const lessonType = {
    ...halftimeLessonType,
    coachBusyLevel: BUSY_LEVELS.FULL,
  };

  const lessons: Lesson[] = [
    buildLesson("8:30", "9:30", halftimeLessonType),
    buildLesson("9:00", "10:00", halftimeLessonType),
  ];

  const expectedSlots = generateSlotsBetween(["10:00", dailyBounds[1]]);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 3rd half-time lesson (1st-2nd full-time floating)", () => {
  const floatingLessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };
  const lessonType = {
    ...floatingLessonType,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.HALF,
  };

  const lessons: Lesson[] = [
    buildLesson("8:30", "9:30", floatingLessonType),
    buildLesson("9:00", "10:00", floatingLessonType),
  ];

  const expectedSlots = generateSlotsBetween(
    [dailyBounds[0], "9:00"],
    ["9:30", dailyBounds[1]]
  );

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd full-time lesson (1st half-time)", () => {
  const halftimeLessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.HALF,
  };
  const lessonType = {
    ...halftimeLessonType,
    coachBusyLevel: BUSY_LEVELS.FULL,
  };

  const lessons: Lesson[] = [buildLesson("8:30", "9:30", halftimeLessonType)];

  const expectedSlots = generateSlotsBetween(["9:30", dailyBounds[1]]);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 3rd full-time lesson (1st half-time, 2nd floating)", () => {
  const lessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };
  const halftimeLessonType = {
    ...lessonType,
    coachBusyLevel: BUSY_LEVELS.HALF,
  };
  const floatingLessonType = {
    ...lessonType,
    coaches: [coachesData[0], coachesData[1]],
  };

  const lessons: Lesson[] = [
    buildLesson("8:30", "9:30", halftimeLessonType),
    buildLesson("9:30", "10:30", floatingLessonType, [
      coachesData[1],
      coachesData[0],
    ]),
  ];

  const expectedSlots = generateSlotsBetween(["10:30", dailyBounds[1]]);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 3rd full-time floating lesson (1st half-time, 2nd fulltime)", () => {
  const fulltimeLessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };
  const halftimeLessonType = {
    ...fulltimeLessonType,
    coachBusyLevel: BUSY_LEVELS.HALF,
  };
  const floatingLessonType = {
    ...fulltimeLessonType,
    coaches: [coachesData[0], coachesData[1]],
  };

  const lessons: Lesson[] = [
    buildLesson("8:30", "9:30", halftimeLessonType),
    buildLesson("9:30", "10:30", fulltimeLessonType),
  ];

  const expectedSlots = generateSlotsBetween(
    [dailyBounds[0], "9:00"],
    ["10:00", dailyBounds[1]]
  );

  assertFreeSlots(lessons, floatingLessonType, expectedSlots);
});

test("Get free slots for 3rd full-time floating lesson (1st fulltime, 2nd fulltime)", () => {
  const fulltimeLessonType: LessonType = {
    id: "test-lesson-type",
    type: LESSON_TYPES.PERSONAL,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.FULL,
  };
  const halftimeLessonType = {
    ...fulltimeLessonType,
    coaches: [coachesData[1]],
  };
  const floatingLessonType = {
    ...fulltimeLessonType,
    coaches: [coachesData[0], coachesData[1]],
  };

  const lessons: Lesson[] = [
    buildLesson("8:30", "9:30", halftimeLessonType),
    buildLesson("8:30", "9:30", fulltimeLessonType),
  ];

  const expectedSlots = generateSlotsBetween(["9:30", dailyBounds[1]]);

  assertFreeSlots(lessons, floatingLessonType, expectedSlots);
});
