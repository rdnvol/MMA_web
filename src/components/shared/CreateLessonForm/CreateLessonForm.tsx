import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Button,
  VStack,
  Heading,
  Input,
  Flex,
  Tag,
  TagLabel,
  ButtonGroup,
  IconButton,
  Icon,
  Box,
  useMediaQuery,
} from "@chakra-ui/react";
import { FaChevronUp, FaChevronDown, FaPlus, FaTimes } from "react-icons/fa";
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
const defaultCoaches: COACHES[] = [COACHES.Sasha, COACHES.Vika];
const colorScheme = "orange";

enum VIEWS {
  NONE,
  SELECT_COACH,
  SELECT_FREES_SLOT,
  ADD_PARTICIPANTS,
}

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
  const [view, setView] = useState<VIEWS>(VIEWS.NONE);
  const [selectedLessonType, setSelectedLessonType] = useState<LESSON_TYPES>(
    LESSON_TYPES.PERSONAL
  );
  const [selectedCoaches, setSelectedCoaches] =
    useState<COACHES[]>(defaultCoaches);

  const [selectedDuration, setSelectedDuration] = useState<string>(
    durationOptions[1]
  );
  const [areFreeSlotsRequested, setAreFreeSlotsRequested] = useState(false);
  const [label, setLabel] = useState<string>("");

  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");

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
      setView(VIEWS.SELECT_FREES_SLOT);
    }
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    resetForm(e);
    onSubmit(label);
  };

  const resetForm = (e?: any) => {
    e?.preventDefault();
    setSelectedLessonType(lessonOptions[0]);
    changeSelectedCoaches([]);
    setLabel("");
    setSelectedDuration(durationOptions[1]);
    setAreFreeSlotsRequested(false);
    onCancel();
    setView(VIEWS.NONE);
  };

  const renderHeader = () => {
    if (view === VIEWS.NONE) {
      return (
        <ButtonGroup
          variant="ghost"
          colorScheme={colorScheme}
          isAttached
          w="full"
          onClick={() => setView(VIEWS.SELECT_COACH)}
        >
          <Button w="full">Book lesson</Button>
          <IconButton
            aria-label="book-lesson-icon"
            icon={<Icon as={FaPlus} />}
          />
        </ButtonGroup>
      );
    }

    if (view === VIEWS.SELECT_COACH) {
      return (
        <Flex
          w="full"
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Box boxSize="10" />
          <Heading size="sm">Book lesson</Heading>
          <IconButton
            variant="ghost"
            colorScheme={colorScheme}
            aria-label="book-lesson-icon"
            icon={<Icon as={FaTimes} />}
            onClick={resetForm}
          />
        </Flex>
      );
    }

    if (view === VIEWS.SELECT_FREES_SLOT || view === VIEWS.ADD_PARTICIPANTS) {
      return (
        <Flex
          w="full"
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            gap="4"
          >
            <Tag size="sm" variant="outline" colorScheme={colorScheme}>
              <TagLabel>{selectedLessonType}</TagLabel>
            </Tag>
            <Heading size="sm">{selectedCoaches.join(", ")}</Heading>
            {selectedFreeSlot &&
              `${format(selectedFreeSlot.date, "E dd")}, ${minutesToTime(
                selectedFreeSlot.startTime
              )} - ${minutesToTime(selectedFreeSlot.endTime)}`}
          </Flex>
          <IconButton
            variant="ghost"
            colorScheme={colorScheme}
            aria-label="book-lesson-icon"
            icon={
              <Icon
                as={
                  view === VIEWS.SELECT_FREES_SLOT ? FaChevronUp : FaChevronDown
                }
              />
            }
            onClick={() =>
              view === VIEWS.SELECT_FREES_SLOT
                ? setView(VIEWS.ADD_PARTICIPANTS)
                : setView(VIEWS.SELECT_FREES_SLOT)
            }
          />
        </Flex>
      );
    }
  };

  const renderSelectLessonTypeForm = () => {
    return (
      <Flex flexDirection="column" justifyContent="space-between" h="full">
        <VStack alignItems="flex-start" spacing={4} overflow="hidden">
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

          <FormControl>
            <FormLabel>Type</FormLabel>
            <RadioGroup
              options={lessonOptions}
              value={selectedLessonType}
              onChange={changeSelectedLessonType}
              colorScheme={colorScheme}
              isDisabled={areFreeSlotsRequested}
            />
          </FormControl>

          <Flex width="full" justifyContent="space-between">
            <Button colorScheme={"gray"} onClick={resetForm}>
              Cancel
            </Button>
            <Button
              colorScheme={colorScheme}
              onClick={showFreeSlots}
              isDisabled={selectedCoaches.length === 0}
            >
              Show free slots
            </Button>
          </Flex>
        </VStack>
      </Flex>
    );
  };

  const renderAddParticipantsForm = () => {
    return (
      <VStack alignItems="flex-start" gap="8">
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            value={label}
            onChange={(evt) => setLabel(evt.target.value)}
            autoFocus
            colorScheme={colorScheme}
          />
        </FormControl>

        <Flex width="full" justifyContent="space-between">
          <Button colorScheme={"gray"} onClick={resetForm}>
            Cancel
          </Button>
          <Button colorScheme={colorScheme} onClick={submitForm}>
            Book lesson
          </Button>
        </Flex>
      </VStack>
    );
  };

  return (
    <Flex
      p="2"
      boxShadow="0 0 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      borderTopRadius="2"
      position="absolute"
      bottom={0}
      h={getHeight(view, isLargerThan500)}
      w="full"
      bg="chakra-body-bg"
      flexDirection="column"
      overflow="hidden"
    >
      {renderHeader()}
      {view === VIEWS.SELECT_COACH && renderSelectLessonTypeForm()}
      {view === VIEWS.ADD_PARTICIPANTS && renderAddParticipantsForm()}
    </Flex>
  );
};

export default CreateLessonForm;

function getHeight(view: VIEWS, isLargerThan500: boolean): number {
  if (view === VIEWS.SELECT_COACH && isLargerThan500) {
    return 276;
  }

  if (view === VIEWS.SELECT_COACH && !isLargerThan500) {
    return 326;
  }

  if (view === VIEWS.ADD_PARTICIPANTS) {
    return 208;
  }

  return 50;
}
