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
} from "../src/constants/data";
import {
  getFreeSlots,
  Meeting,
  mergeDateAndTime,
  timeToMinutes,
} from "../src/utils/calendar";

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
  coachOrder: Coach[] = []
): Lesson {
  return {
    id: 1,
    name: "test-lesson",
    participants: [],
    startDate: mergeDateAndTime(date, startTime).toISOString(),
    endDate: mergeDateAndTime(date, endTime).toISOString(),
    lessonType,
    coachOrder: coachOrder.map((coach) => coach.id),
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
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.Full,
  };

  const lessons: Lesson[] = [];

  const expectedSlots = generateSlotsBetween(dailyBounds);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd full-time lesson (1st full-time, same coach)", () => {
  const lessonType: LessonType = {
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.Full,
  };

  const lessons: Lesson[] = [buildLesson("8:00", "9:00", lessonType)];

  const expectedSlots = generateSlotsBetween(["9:00", dailyBounds[1]]);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd full-time lesson (1st full-time, another coach)", () => {
  const lessonType: LessonType = {
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.Full,
  };
  const anotherLessonType = { ...lessonType, coaches: [coachesData[1]] };

  const lessons: Lesson[] = [buildLesson("8:00", "9:00", anotherLessonType)];

  const expectedSlots = generateSlotsBetween(dailyBounds);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd full-time floating lesson (1st full-time floating)", () => {
  const lessonType: LessonType = {
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.Full,
  };

  const lessons: Lesson[] = [buildLesson("8:00", "9:00", lessonType)];

  const expectedSlots = generateSlotsBetween(dailyBounds);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd half-time lesson (1st half-time, same coach)", () => {
  const lessonType: LessonType = {
    id: 10,
    type: LESSON_TYPES.Split,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.Half,
  };

  const lessons: Lesson[] = [buildLesson("8:00", "9:00", lessonType)];

  const expectedSlots = generateSlotsBetween(dailyBounds);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 2nd full-time lesson (1st full-time floating)", () => {
  const lessonType: LessonType = {
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.Full,
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
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.Full,
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
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.Full,
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
    id: 10,
    type: LESSON_TYPES.Split,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.Half,
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

test("Get free slots for 3rd full-time lesson (1st-2nd full-time floating)", () => {
  const floatingLessonType: LessonType = {
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.Full,
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
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.Full,
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
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.Full,
  };

  const lessons: Lesson[] = [
    buildLesson("8:30", "9:30", lessonType, [coachesData[0], coachesData[1]]),
  ];

  const expectedSlots = generateSlotsBetween(dailyBounds);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 3rd full-time lesson (1st-2nd half-time)", () => {
  const halftimeLessonType: LessonType = {
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.Half,
  };
  const lessonType = {
    ...halftimeLessonType,
    coachBusyLevel: BUSY_LEVELS.Full,
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
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.Full,
  };
  const lessonType = {
    ...floatingLessonType,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.Half,
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
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.Half,
  };
  const lessonType = {
    ...halftimeLessonType,
    coachBusyLevel: BUSY_LEVELS.Full,
  };

  const lessons: Lesson[] = [buildLesson("8:30", "9:30", halftimeLessonType)];

  const expectedSlots = generateSlotsBetween(["9:30", dailyBounds[1]]);

  assertFreeSlots(lessons, lessonType, expectedSlots);
});

test("Get free slots for 3rd full-time lesson (1st half-time, 2nd floating)", () => {
  const lessonType: LessonType = {
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.Full,
  };
  const halftimeLessonType = {
    ...lessonType,
    coachBusyLevel: BUSY_LEVELS.Half,
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
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.Full,
  };
  const halftimeLessonType = {
    ...fulltimeLessonType,
    coachBusyLevel: BUSY_LEVELS.Half,
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
    id: 10,
    type: LESSON_TYPES.Personal,
    coaches: [coachesData[0]],
    coachBusyLevel: BUSY_LEVELS.Full,
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

test("Get free slots for 2nd full-time lesson (1st fulltime floating Other)", () => {
  const floatingLessonType: LessonType = {
    id: 10,
    type: LESSON_TYPES.Other,
    coaches: [coachesData[0], coachesData[1]],
    coachBusyLevel: BUSY_LEVELS.Full,
  };
  const fulltimeLessonType = {
    ...floatingLessonType,
    type: LESSON_TYPES.Massage,
    coaches: [coachesData[1]],
  };

  const lessons: Lesson[] = [buildLesson("8:30", "9:30", fulltimeLessonType)];

  const expectedSlots = generateSlotsBetween(["9:30", dailyBounds[1]]);

  assertFreeSlots(lessons, floatingLessonType, expectedSlots);
});
