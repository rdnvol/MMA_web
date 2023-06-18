import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Container,
  Button,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { COACHES, coachesData } from "../../../constants/data";
import { LESSON_TYPES } from "../../../models";
import { RadioGroup } from "../../base/RadioGroup/RadioGroup";
import { CheckboxGroup } from "../../base/CheckboxGroup/CheckboxGroup";

const lessonOptions: LESSON_TYPES[] = [
  LESSON_TYPES.SPLIT,
  LESSON_TYPES.GROUP,
  LESSON_TYPES.PERSONAL,
  LESSON_TYPES.MASSAGE,
];
const coachesOptions = coachesData.map((coach) => coach.name);
const durationOptions = ["30", "60", "90"];

const colorScheme = "orange";

export type CreateLessonFormProps = {
  onShowFreeSlots: (
    lessonType: LESSON_TYPES,
    coaches: COACHES[],
    duration: number
  ) => void;
};

export const CreateLessonForm: React.FC<CreateLessonFormProps> = (props) => {
  const [selectedLessonType, setSelectedLessonType] = useState<string>(
    lessonOptions[0]
  );
  const [selectedCoaches, setSelectedCoaches] = useState<COACHES[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>(
    durationOptions[1]
  );

  const changeSelectedCoaches = (value: string[]) => {
    setSelectedCoaches(value as COACHES[]);
  };

  const showFreeSlots = (e: any) => {
    if (selectedCoaches.length) {
      props.onShowFreeSlots(
        selectedLessonType as LESSON_TYPES,
        selectedCoaches as COACHES[],
        +selectedDuration
      );
    }
  };

  return (
    <form>
      <VStack w="300px" alignItems="flex-start" spacing={8}>
        <Heading>Add lesson</Heading>
        <FormControl>
          <FormLabel>Lesson type</FormLabel>
          <RadioGroup
            options={lessonOptions}
            value={selectedLessonType}
            onChange={setSelectedLessonType}
            colorScheme={colorScheme}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Coaches</FormLabel>
          <CheckboxGroup
            options={coachesOptions}
            value={selectedCoaches}
            onChange={changeSelectedCoaches}
            colorScheme={colorScheme}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Duration</FormLabel>
          <RadioGroup
            options={durationOptions}
            value={selectedDuration}
            onChange={setSelectedDuration}
            colorScheme={colorScheme}
          />
        </FormControl>
        <Button colorScheme={colorScheme} type="button" onClick={showFreeSlots}>
          Show free slots
        </Button>
      </VStack>
    </form>
  );
};

export default CreateLessonForm;
