import {
  Checkbox,
  FormControl,
  CheckboxGroup,
  ButtonGroup,
  IconButton,
  Icon,
  Button,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { COACHES } from "../../../constants/data";
import { Coach } from "../../../models";
import { useGetCoachesQuery } from "../../../services/coaches";
// import RadioGroup from "../../base/RadioGroup/RadioGroup";
import { addDays, format, subDays } from "date-fns";
import { DATE_FORMAT } from "../../../constants/data";
import { getCurrentWeek } from "../../../utils/calendar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Logo } from "../../base/Logo/Logo";
import { useSearchParams } from "react-router-dom";

export type CalendarControlProps = {};

type View = "1" | "3" | "7";

export const CalendarControl: React.FC<CalendarControlProps> = () => {
  const [, setSearchParams] = useSearchParams();

  const { data: coachesData = [] } = useGetCoachesQuery("");

  const [coaches, setCoaches] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>("7");

  useEffect(() => {
    const bounds = getBounds(selectedDate, view);

    setSearchParams({
      startDate: format(bounds[0], DATE_FORMAT),
      endDate: format(bounds[1], DATE_FORMAT),
      // coaches,
    });
  }, [selectedDate, view, coaches, setSearchParams]);

  useEffect(() => {
    setCoaches(coachesData.map((coach) => String(coach.id)));
  }, [coachesData]);

  const updateCoaches = (value: Array<string>) => {
    setCoaches(value);
  };

  const updateView = (value: string) => {
    setView(value as View);
  };

  const next = () => {
    setSelectedDate(addDays(selectedDate, +view));
  };

  const prev = () => {
    setSelectedDate(subDays(selectedDate, +view));
  };

  return (
    <HStack h="full" alignItems="center" gap="2">
      <Logo h="10" w="10" />

      <FormControl>
        <CheckboxGroup onChange={updateCoaches} value={coaches}>
          <HStack spacing={5} alignItems="flex-start">
            {coachesData.map((coach) => (
              <Checkbox
                key={coach.id}
                value={String(coach.id)}
                colorScheme={getCoachColorScheme(coach)}
              >
                {coach.name}
              </Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </FormControl>

      <FormControl w="fit-content">
        <ButtonGroup size="sm" colorScheme="orange" variant="ghost" isAttached>
          <IconButton
            aria-label="prev"
            icon={<Icon as={FaChevronLeft} />}
            onClick={prev}
          />
          <Button onClick={() => setSelectedDate(new Date())}>Today</Button>
          <IconButton
            aria-label="next"
            icon={<Icon as={FaChevronRight} />}
            onClick={next}
          />
        </ButtonGroup>
      </FormControl>

      {/* <FormControl>
        <RadioGroup
          options={["1", "3", "7"]}
          mode="button-group"
          // colorScheme="orange"
          value={view}
          onChange={updateView}
        />
      </FormControl> */}
    </HStack>
  );
};

export default CalendarControl;

// Utils
function getCoachColorScheme(coach: Coach) {
  const colorsMap: Record<COACHES, string> = {
    [COACHES.Sasha]: "red",
    [COACHES.Vika]: "green",
    [COACHES.Empty]: "gray",
  };

  return colorsMap[coach.name as COACHES] || colorsMap[COACHES.Empty];
}

function getBounds(current: Date, view: View): [Date, Date] {
  if (view === "1") {
    return [current, current];
  }

  if (view === "3") {
    return [subDays(current, 1), addDays(current, 1)];
  }

  const week = getCurrentWeek(current);

  return [week[0], week[week.length - 1]];
}
