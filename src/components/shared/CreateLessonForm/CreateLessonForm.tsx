import React, { useEffect, useMemo, useState } from "react";
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
  Text,
} from "@chakra-ui/react";
import { FaChevronUp, FaChevronDown, FaPlus, FaTimes } from "react-icons/fa";
import { DATE_FORMAT, Event } from "../../../constants/data";
import { LessonType, LESSON_TYPES } from "../../../models";
import RadioGroup from "../../base/RadioGroup/RadioGroup";
import CheckboxGroup from "../../base/CheckboxGroup/CheckboxGroup";
import { format, parse } from "date-fns";
import { mergeDateAndTime, minutesToTime } from "../../../utils/calendar";
import { useGetCoachesQuery } from "../../../services/coaches";
import { useGetLessonTypesQuery } from "../../../services/lessonTypes";
import { createLesson } from "../../../services/lessons";

const lessonOptions: LESSON_TYPES[] = [
  LESSON_TYPES.Personal,
  LESSON_TYPES.Group,
  LESSON_TYPES.Split,
  LESSON_TYPES.Massage,
  LESSON_TYPES.Other,
];

type LessonTypesMap = Record<string, LessonType>;

const durationOptions = ["30", "60"];
const colorScheme = "orange";

enum VIEWS {
  NONE,
  SELECT_COACH,
  SELECT_FREES_SLOT,
  DATE_TIME,
  ADD_PARTICIPANTS,
}

export type CreateLessonFormProps = {
  onShowFreeSlots: (lessonType: LessonType, duration: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
  selectedFreeSlot?: Event;
};

export const CreateLessonForm: React.FC<CreateLessonFormProps> = ({
  selectedFreeSlot,
  onShowFreeSlots,
  onSubmit,
  onCancel,
}) => {
  const { data: coachesData = [] } = useGetCoachesQuery("");
  const { data: lessonTypesData = [] } = useGetLessonTypesQuery("");

  const [view, setView] = useState<VIEWS>(VIEWS.NONE);

  const [selectedCoaches, setSelectedCoaches] = useState<number[]>([]);
  const [selectedLessonType, setSelectedLessonType] = useState<
    LESSON_TYPES | undefined
  >();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedStartTime, setSelectedStartTime] = useState<string>("");
  const [selectedEndTime, setSelectedEndTime] = useState<string>("");
  const [selectedDuration] = useState<string>(durationOptions[1]);
  const [label, setLabel] = useState<string>("");

  const [isLargerThan500] = useMediaQuery("(min-width: 500px)");

  const lessonTypesMap: LessonTypesMap = useMemo(() => {
    return getLessonTypesMap(lessonTypesData, selectedCoaches);
  }, [lessonTypesData, selectedCoaches]);

  useEffect(() => {
    setSelectedLessonType(undefined);
  }, [selectedCoaches.length]);

  useEffect(() => {
    if (!!selectedFreeSlot) {
      setSelectedDate(selectedFreeSlot.date);
      setSelectedStartTime(minutesToTime(selectedFreeSlot.startTime));
      setSelectedEndTime(minutesToTime(selectedFreeSlot.endTime));

      setView(VIEWS.ADD_PARTICIPANTS);
    }
  }, [selectedFreeSlot]);

  const coachesOptions = coachesData.map((coach) => ({
    value: coach.id,
    label: coach.name,
  }));

  const lessonTypesOptions = lessonOptions.map((option) => {
    return {
      isDisabled: !lessonTypesMap[option],
      value: option,
      label: option,
    };
  });

  const changeSelectedCoaches = (value: string[]) => {
    setSelectedCoaches(value.map((v) => +v));
  };

  const changeSelectedLessonType = (value: string) => {
    setSelectedLessonType(value as LESSON_TYPES);
  };

  const showFreeSlots = (e: any) => {
    if (selectedLessonType) {
      onShowFreeSlots(lessonTypesMap[selectedLessonType], +selectedDuration);
      setView(VIEWS.SELECT_FREES_SLOT);
    }
  };

  const showManualDateTimeInput = () => {
    if (selectedLessonType) {
      setView(VIEWS.DATE_TIME);
    }
  };

  const submitForm = async (e: any) => {
    e.preventDefault();

    if (
      !selectedLessonType ||
      !selectedDate ||
      !selectedStartTime ||
      !selectedEndTime
    ) {
      return;
    }

    await createLesson({
      lessonTypeId: lessonTypesMap[selectedLessonType].id,
      startDate: mergeDateAndTime(
        selectedDate,
        selectedStartTime
      ).toISOString(),
      endDate: mergeDateAndTime(selectedDate, selectedEndTime).toISOString(),
      name: label,
    });

    resetForm(e);
    onSubmit();
  };

  const resetForm = (e?: any) => {
    e?.preventDefault();
    setSelectedLessonType(undefined);
    setSelectedCoaches([]);
    setLabel("");
    setSelectedDate(undefined);
    setSelectedStartTime("");
    setSelectedEndTime("");

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

    if (
      view === VIEWS.SELECT_FREES_SLOT ||
      view === VIEWS.ADD_PARTICIPANTS ||
      view === VIEWS.DATE_TIME
    ) {
      return (
        <Flex
          w="full"
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
          minH="8"
        >
          <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            gap="3"
          >
            <Tag size="sm" variant="outline" colorScheme={colorScheme}>
              <TagLabel>{selectedLessonType}</TagLabel>
            </Tag>
            <Heading size="sm" noOfLines={1}>
              {selectedLessonType &&
                lessonTypesMap[selectedLessonType].coaches
                  .map((coach) => coach.name)
                  .join(", ")}
            </Heading>
            <Text noOfLines={1}>
              {selectedDate && format(selectedDate, "E dd")}
              {selectedStartTime && `, ${selectedStartTime}`}
              {selectedEndTime && ` - ${selectedEndTime}`}
            </Text>
          </Flex>
          {view !== VIEWS.DATE_TIME && (
            <IconButton
              variant="ghost"
              colorScheme={colorScheme}
              aria-label="book-lesson-icon"
              icon={
                <Icon
                  as={
                    view === VIEWS.SELECT_FREES_SLOT
                      ? FaChevronUp
                      : FaChevronDown
                  }
                />
              }
              onClick={() =>
                view === VIEWS.SELECT_FREES_SLOT
                  ? setView(VIEWS.ADD_PARTICIPANTS)
                  : setView(VIEWS.SELECT_FREES_SLOT)
              }
            />
          )}
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
            />
          </FormControl>

          <FormControl>
            <FormLabel>Type</FormLabel>
            <RadioGroup
              // TODO: Find better solution
              key={selectedCoaches.length}
              options={lessonTypesOptions}
              value={selectedLessonType}
              onChange={changeSelectedLessonType}
              colorScheme={colorScheme}
            />
          </FormControl>

          <Flex width="full" justifyContent="space-between">
            <Button colorScheme={"gray"} onClick={resetForm}>
              Cancel
            </Button>
            <Button
              variant="ghost"
              colorScheme={colorScheme}
              onClick={showManualDateTimeInput}
              isDisabled={selectedCoaches.length === 0 || !selectedLessonType}
            >
              Manual
            </Button>
            <Button
              colorScheme={colorScheme}
              onClick={showFreeSlots}
              isDisabled={selectedCoaches.length === 0 || !selectedLessonType}
            >
              Show free slots
            </Button>
          </Flex>
        </VStack>
      </Flex>
    );
  };

  const renderDateTimeInputForm = () => {
    return (
      <VStack mt="2">
        <FormControl>
          <Input
            autoFocus
            size="md"
            type="date"
            colorScheme={colorScheme}
            value={selectedDate ? format(selectedDate, DATE_FORMAT) : ""}
            onChange={(evt) =>
              setSelectedDate(parse(evt.target.value, DATE_FORMAT, new Date()))
            }
          />
        </FormControl>
        <FormControl as={Flex}>
          <Input
            placeholder="From"
            size="md"
            type="time"
            colorScheme={colorScheme}
            value={selectedStartTime}
            onChange={(evt) => setSelectedStartTime(evt.target.value)}
          />
          <Input
            placeholder="To"
            size="md"
            type="time"
            colorScheme={colorScheme}
            value={selectedEndTime}
            onChange={(evt) => setSelectedEndTime(evt.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            value={label}
            onChange={(evt) => setLabel(evt.target.value)}
            colorScheme={colorScheme}
          />
        </FormControl>

        <Flex width="full" justifyContent="space-between">
          <Button colorScheme={"gray"} onClick={resetForm}>
            Cancel
          </Button>
          <Button
            colorScheme={colorScheme}
            onClick={submitForm}
            isDisabled={!selectedDate || !selectedStartTime || !selectedEndTime}
          >
            Book lesson
          </Button>
        </Flex>
      </VStack>
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
          <Button
            colorScheme={colorScheme}
            onClick={submitForm}
            isDisabled={!selectedDate || !selectedStartTime || !selectedEndTime}
          >
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
      zIndex={5}
    >
      {renderHeader()}
      {view === VIEWS.SELECT_COACH && renderSelectLessonTypeForm()}
      {view === VIEWS.DATE_TIME && renderDateTimeInputForm()}
      {view === VIEWS.ADD_PARTICIPANTS && renderAddParticipantsForm()}
    </Flex>
  );
};

export default CreateLessonForm;

// Utils
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

  if (view === VIEWS.DATE_TIME) {
    return 272;
  }

  return 50;
}

function filterLessonTypesByCoaches(
  lessonTypes: LessonType[],
  selectedCoaches: number[]
): LessonType[] {
  const filteredLessonTypes = lessonTypes.filter(
    (lessonType) =>
      lessonType.coaches.length === selectedCoaches.length &&
      selectedCoaches.every(
        (coachId) => !!lessonType.coaches.find((coach) => coach.id === coachId)
      )
  );

  return filteredLessonTypes;
}

function getLessonTypesMap(
  lessonTypes: LessonType[],
  selectedCoaches: number[]
): LessonTypesMap {
  const filteredLessonTypes = filterLessonTypesByCoaches(
    lessonTypes,
    selectedCoaches
  );

  return filteredLessonTypes.reduce(
    (result, lessonType) => ({
      ...result,
      [lessonType.type]: lessonType,
    }),
    {}
  );
}
