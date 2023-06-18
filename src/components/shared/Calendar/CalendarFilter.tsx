import React, { useEffect, useState } from "react";
import { COACHES } from "../../../constants/data";
import { Coach } from "../../../models";
import { useGetCoachesQuery } from "../../../services/coaches";

import CheckboxGroup from "../../base/CheckboxGroup/CheckboxGroup";

export type CalendarFilterProps = {
  onSearch?: (filters: { coaches: string[] }) => void;
};

export const CalendarFilter: React.FC<CalendarFilterProps> = ({ onSearch }) => {
  const { data: coachesData } = useGetCoachesQuery("");

  const [coaches, setCoaches] = useState<string[]>([]);

  useEffect(() => {
    if (onSearch) {
      onSearch({ coaches });
    }
  }, [coaches]);

  return (
    <React.Fragment>
      <CheckboxGroup
        options={
          coachesData?.map((coach) => ({
            // TODO
            // value: coach.name,
            value: coach.name,
            label: coach.name,
            colorScheme: getCoachColorScheme(coach),
          })) || []
        }
        value={coaches}
        onChange={setCoaches}
      />
    </React.Fragment>
  );
};

export default CalendarFilter;

// Utils
function getCoachColorScheme(coach: Coach) {
  const colorsMap: Record<COACHES, string> = {
    [COACHES.Sasha]: "red",
    [COACHES.Vika]: "green",
    [COACHES.Empty]: "gray",
  };

  return colorsMap[coach.name as COACHES] || colorsMap[COACHES.Empty];
}
