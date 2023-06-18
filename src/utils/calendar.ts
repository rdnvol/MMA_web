import { addDays, getWeek, subDays } from "date-fns";
import {
  COACHES,
  Event,
  PositionedEvent,
  slotDuration,
} from "../constants/data";

export type Calendar = Meeting[];
export type Meeting = [number, number];

type EventsLine = Event[];

export function getCurrentWeek(today: Date) {
  const week = getWeek(today);

  let currentWeek = [];

  let minDayOfWeek = today;
  let maxDayOfWeek = today;

  while (week === getWeek(minDayOfWeek)) {
    currentWeek.unshift(minDayOfWeek);
    minDayOfWeek = subDays(minDayOfWeek, 1);
  }

  while (week === getWeek(maxDayOfWeek)) {
    currentWeek.push(maxDayOfWeek);
    maxDayOfWeek = addDays(maxDayOfWeek, 1);
  }

  currentWeek = currentWeek.slice(1);

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

// function printCalendar(calendar: Calendar) {
//   console.log(calendar.map((meeting) => meeting.map(minutesToTime)));
// }

function compareEvents(eventA: Event, eventB: Event): number {
  if (eventA.startTime > eventB.startTime) return 1;
  if (eventA.startTime < eventB.startTime) return -1;
  return 0;
}

function getFulfilledCalendar(
  calendar: Calendar,
  dailyBounds: [number, number]
): Calendar {
  return [
    [timeToMinutes("0:00"), dailyBounds[0]],
    ...calendar,
    [dailyBounds[1], timeToMinutes("23:59")],
  ];
}

function getFlattenCalendar(calendar: Calendar): Calendar {
  const flattened: Calendar = [calendar[0]];

  for (let i = 1; i < calendar.length; i++) {
    const currentMeeting = calendar[i];
    const previousMeeting = flattened[flattened.length - 1];

    const [currentStart, currentEnd] = currentMeeting;
    const [previousStart, previousEnd] = previousMeeting;

    if (previousEnd >= currentStart) {
      const newPreviousMeeting: Meeting = [
        previousStart,
        Math.max(previousEnd, currentEnd),
      ];
      flattened[flattened.length - 1] = newPreviousMeeting;
    } else {
      flattened.push(currentMeeting);
    }
  }
  return flattened;
}

function getMatchingAvailabilities(
  calendar: Calendar,
  meetingDuration: number
): Calendar {
  const matchingAvailabilities: Calendar = [];

  for (let i = 1; i < calendar.length; i++) {
    const start = calendar[i - 1][1];
    const end = calendar[i][0];

    const availabilityDuration = end - start;

    if (availabilityDuration >= meetingDuration) {
      matchingAvailabilities.push([start, end]);
    }
  }

  return matchingAvailabilities;
}

function getEventsLinesFromEvents(events: Event[]): EventsLine[] {
  if (!events.length) {
    return [];
  }
  events.sort(compareEvents);

  const eventsLines: EventsLine[] = [[events[0]]];

  for (let i = 1; i < events.length; i++) {
    const currentEvent = events[i];
    let isAdded = false;

    for (let j = 0; j < eventsLines.length; j++) {
      const previousEvent = eventsLines[j][eventsLines[j].length - 1];

      if (previousEvent.endTime <= currentEvent.startTime) {
        eventsLines[j].push(currentEvent);
        isAdded = true;
        break;
      }
    }

    if (!isAdded) {
      eventsLines.push([currentEvent]);
    }
  }

  return eventsLines;
}

export function getPositionedEvents(
  events: Event[],
  dailyBounds: [number, number],
  slotDuration: number
): PositionedEvent[] {
  const eventsLines: EventsLine[] = getEventsLinesFromEvents(events);
  const positionedEvents: PositionedEvent[] = [];

  eventsLines.forEach((eventsLine: EventsLine, index: number) => {
    for (const event of eventsLine) {
      positionedEvents.push({
        ...event,
        position: {
          x: index / eventsLines.length,
          y: (event.startTime - dailyBounds[0]) / slotDuration,
          w: 1 / eventsLines.length,
          h: (event.endTime - event.startTime) / slotDuration,
        },
      });
    }
  });

  return positionedEvents;
}

export function getFreeSlots(
  events: Event[],
  dailyBounds: [number, number],
  duration: number,
  date: Date,
  coaches?: COACHES[]
): PositionedEvent[] {
  const filteredEvents = coaches?.length
    ? events.filter((event: Event) =>
        event.coaches.some((coach) => coaches.includes(coach))
      )
    : events;

  const calendar: Calendar = filteredEvents.map((event: Event) => [
    event.startTime,
    event.endTime,
  ]);

  const fulfilledCalendar = getFulfilledCalendar(calendar, dailyBounds);
  const flattenCalendar = getFlattenCalendar(fulfilledCalendar);
  const freeCalendar = getMatchingAvailabilities(flattenCalendar, duration);

  const freeSlots: Meeting[] = [];

  for (const meeting of freeCalendar) {
    let currentMeeting: Meeting = [meeting[0], meeting[0] + duration];

    while (currentMeeting[1] <= meeting[1]) {
      freeSlots.push(currentMeeting);

      currentMeeting = [
        currentMeeting[0] + slotDuration,
        currentMeeting[1] + slotDuration,
      ];
    }
  }

  return freeSlots.map((meeting: Meeting) => ({
    id: "free-item",
    coaches: [],
    date,
    startTime: meeting[0],
    endTime: meeting[1],
    position: {
      x: 0,
      y: (meeting[0] - dailyBounds[0]) / slotDuration,
      w: 1,
      h: (meeting[1] - meeting[0]) / slotDuration,
    },
  }));
}
