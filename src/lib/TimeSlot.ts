import { Event } from "../constants/data";
import { Coach } from "../models";
import arrayToMap from "../utils/arrayToMap";
import { Meeting } from "../utils/calendar";

type Business = {
  floating: Event[];
  fulltime: Event[];
  halftime: Event[];
};

export default class TimeSlot {
  constructor(
    public startTime: number,
    public duration: number,
    public isFloating?: boolean,
    private coachToBusiness: Record<string, Business> = {}
  ) {}

  getBounds(): [number, number] {
    return [this.startTime, this.startTime + this.duration];
  }

  addEvent(event: Event) {
    if (event.coachOrder && event.coachOrder.length > 1) {
      const events = splitOrderedEvent(event).filter((event) =>
        isCoveringBounds(this.getBounds(), [event.startTime, event.endTime])
      );

      events.forEach((event) =>
        this._addEventForCoach(event.coaches[0].id, event)
      );
    } else {
      event.coaches.forEach((coach) => this._addEventForCoach(coach.id, event));
    }
  }

  _addEventForCoach(coach: number, event: Event) {
    if (!this.coachToBusiness[coach]) {
      this.coachToBusiness[coach] = {
        floating: [],
        fulltime: [],
        halftime: [],
      };
    }

    const business = this.coachToBusiness[coach];

    if (event.isFloating) {
      business.floating.push(event);
    } else if (event.isHalfTime) {
      business.halftime.push(event);
    } else {
      business.fulltime.push(event);
    }
  }

  isAvailableForFulltime(coaches: number[]): boolean {
    return coaches.every((coach) =>
      this._isAvailableForFulltime(this.coachToBusiness[coach])
    );
  }

  _isAvailableForFulltime(business?: Business) {
    if (!business) {
      return true;
    }

    if (business.fulltime.length > 0) {
      return false;
    }

    if (business.halftime.length > 0) {
      return false;
    }

    if (
      business.floating.some((event: Event) =>
        isCoveringBounds([event.startTime, event.endTime], this.getBounds())
      )
    ) {
      return false;
    }

    if (
      business.floating.filter((event: Event) =>
        isCrossBounds([event.startTime, event.endTime], this.getBounds())
      ).length >= 2
    ) {
      return false;
    }

    return true;
  }

  isAvailableForHalftime(coaches: number[]): boolean {
    return coaches.every((coach) =>
      this._isAvailableForHalftime(this.coachToBusiness[coach])
    );
  }

  _isAvailableForHalftime(business?: Business): boolean {
    if (!business) {
      return true;
    }

    if (business.fulltime.length > 0) {
      return false;
    }

    if (
      business.halftime.filter((event: Event) =>
        isCrossBounds([event.startTime, event.endTime], this.getBounds())
      ).length >= 2
    ) {
      return false;
    }

    if (
      business.floating.some((event: Event) =>
        isCoveringBounds([event.startTime, event.endTime], this.getBounds())
      )
    ) {
      return false;
    }

    if (
      business.floating.filter((event: Event) =>
        isCrossBounds([event.startTime, event.endTime], this.getBounds())
      ).length >= 2
    ) {
      return false;
    }

    return true;
  }

  isAvailableForFloating(coaches: number[]): boolean {
    return coaches.every((coach) =>
      this._isAvailableForFloating(this.coachToBusiness[coach])
    );
  }

  _isAvailableForFloating(business?: Business): boolean {
    if (!business) {
      return true;
    }

    if (
      business.fulltime.some((event: Event) =>
        isCoveringBounds([event.startTime, event.endTime], this.getBounds())
      )
    ) {
      return false;
    }

    if (
      business.halftime.some((event: Event) =>
        isCoveringBounds([event.startTime, event.endTime], this.getBounds())
      )
    ) {
      return false;
    }

    if (
      [...business.fulltime, ...business.halftime].filter((event) =>
        isCrossBounds([event.startTime, event.endTime], this.getBounds())
      ).length >= 2
    ) {
      return false;
    }

    if (
      business.floating.filter((event) =>
        isCrossBounds([event.startTime, event.endTime], this.getBounds())
      ).length >= 2
    ) {
      return false;
    }

    return true;
  }
}

function isCoveringBounds(boundsA: Meeting, boundsB: Meeting): boolean {
  return boundsA[0] <= boundsB[0] && boundsA[1] >= boundsB[1];
}

function isCrossBounds(boundsA: Meeting, boundsB: Meeting): boolean {
  if (boundsA[0] >= boundsB[0] && boundsA[0] < boundsB[1]) {
    return true;
  }

  if (boundsA[1] > boundsB[0] && boundsA[1] <= boundsB[1]) {
    return true;
  }

  return false;
}

function splitOrderedEvent(event: Event): Event[] {
  const { startTime, endTime, coachOrder } = event;

  if (!coachOrder || !coachOrder.length) {
    return [event];
  }

  const orderDuration = (endTime - startTime) / coachOrder.length;

  const coachesMap = arrayToMap<Coach>(event.coaches);

  return coachOrder.map((coachId, index) => ({
    ...event,
    coaches: [coachesMap[coachId]],
    startTime: startTime + index * orderDuration,
    endTime: startTime + (index + 1) * orderDuration,
  }));
}
