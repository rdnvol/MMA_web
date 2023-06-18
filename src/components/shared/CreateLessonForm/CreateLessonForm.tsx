import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Button,
  VStack,
  Heading,
  Input,
} from "@chakra-ui/react";
import { COACHES, coachesData, Event } from "../../../constants/data";
import { LESSON_TYPES } from "../../../models";
import RadioGroup from "../../base/RadioGroup/RadioGroup";
import CheckboxGroup from "../../base/CheckboxGroup/CheckboxGroup";
import { format } from "date-fns";
import { minutesToTime } from "../../../utils/calendar";

const lessonOptions: LESSON_TYPES[] = [
  LESSON_TYPES.PERSONAL,
  LESSON_TYPES.SPLIT,
  LESSON_TYPES.GROUP,
  LESSON_TYPES.MASSAGE,
  LESSON_TYPES.OTHER,
];
const singleCoachLessonTypes: LESSON_TYPES[] = [
  LESSON_TYPES.SPLIT,
  LESSON_TYPES.MASSAGE,
];
const coachesOptions = coachesData.map((coach) => coach.name);
const durationOptions = ["30", "60"];

const colorScheme = "orange";

export type CreateLessonFormProps = {
  onShowFreeSlots: (
    lessonType: LESSON_TYPES,
    coaches: COACHES[],
    duration: number
  ) => void;
  onSubmit: (label: string) => void;
  onCancel: () => void;
  selectedFreeSlot?: Event;
};

export const CreateLessonForm: React.FC<CreateLessonFormProps> = ({
  selectedFreeSlot,
  onShowFreeSlots,
  onSubmit,
  onCancel,
}) => {
  const [selectedLessonType, setSelectedLessonType] = useState<LESSON_TYPES>(
    lessonOptions[0]
  );
  const [selectedCoaches, setSelectedCoaches] = useState<COACHES[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>(
    durationOptions[1]
  );
  const [areFreeSlotsRequested, setAreFreeSlotsRequested] = useState(false);
  const [label, setLabel] = useState<string>("");

  const changeSelectedCoaches = (value: string[]) => {
    if (
      singleCoachLessonTypes.includes(selectedLessonType) &&
      value.length > 1
    ) {
      return;
    }

    setSelectedCoaches(value as COACHES[]);
  };

  const changeSelectedLessonType = (value: string) => {
    setSelectedLessonType(value as LESSON_TYPES);
  };

  const showFreeSlots = (e: any) => {
    if (selectedCoaches.length) {
      onShowFreeSlots(
        selectedLessonType as LESSON_TYPES,
        selectedCoaches as COACHES[],
        +selectedDuration
      );
      setAreFreeSlotsRequested(true);
    }
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    resetForm(e);
    onSubmit(label);
  };

  const resetForm = (e: any) => {
    e.preventDefault();
    setSelectedLessonType(lessonOptions[0]);
    changeSelectedCoaches([]);
    setLabel("");
    setSelectedDuration(durationOptions[1]);
    setAreFreeSlotsRequested(false);
    onCancel();
  };

  return (
    <form onSubmit={submitForm} onReset={resetForm}>
      <VStack
        w="300px"
        paddingX={5}
        alignItems="flex-start"
        spacing={4}
        overflow="hidden"
      >
        <Heading size="md">Book lesson</Heading>
        <FormControl>
          <FormLabel>Lesson type</FormLabel>
          <RadioGroup
            options={lessonOptions}
            value={selectedLessonType}
            onChange={changeSelectedLessonType}
            colorScheme={colorScheme}
            isDisabled={areFreeSlotsRequested}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Coaches</FormLabel>
          <CheckboxGroup
            options={coachesOptions}
            value={selectedCoaches}
            onChange={changeSelectedCoaches}
            colorScheme={colorScheme}
            isDisabled={areFreeSlotsRequested}
          />
        </FormControl>
        {/* <FormControl>
          <FormLabel>Duration</FormLabel>
          <RadioGroup
            options={durationOptions}
            value={selectedDuration}
            onChange={setSelectedDuration}
            colorScheme={colorScheme}
          />
        </FormControl> */}
        <Button
          colorScheme={colorScheme}
          type="button"
          onClick={showFreeSlots}
          isDisabled={areFreeSlotsRequested || selectedCoaches.length === 0}
        >
          Show free slots
        </Button>

        <FormControl>
          <FormLabel>
            {selectedFreeSlot &&
              `${format(selectedFreeSlot.date, "E dd")}: ${minutesToTime(
                selectedFreeSlot.startTime
              )} - ${minutesToTime(selectedFreeSlot.endTime)}`}
          </FormLabel>
        </FormControl>

        {selectedFreeSlot && (
          <FormControl>
            <FormLabel>Participants</FormLabel>
            <Input
              value={label}
              onChange={(evt) => setLabel(evt.target.value)}
              autoFocus
              colorScheme={colorScheme}
            />
          </FormControl>
        )}

        <Button
          colorScheme={colorScheme}
          type="submit"
          isDisabled={!selectedFreeSlot}
        >
          Book lesson
        </Button>
        <Button colorScheme={"gray"} type="reset">
          Cancel
        </Button>
      </VStack>
    </form>
  );
};

export default CreateLessonForm;
