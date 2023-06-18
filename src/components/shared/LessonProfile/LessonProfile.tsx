import {
  VStack,
  Text,
  Flex,
  Heading,
  Icon,
  IconButton,
  Tag,
  TagLabel,
  StackDivider,
  Box,
  Button,
  Divider,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Coach } from "../../../models";
import {
  useDeleteLessonMutation,
  useGetLessonQuery,
  useUpdateLessonMutation,
} from "../../../services/lesson";
import arrayToMap from "../../../utils/arrayToMap";
import { FaExchangeAlt } from "react-icons/fa";
import { CoachesCard } from "../../base/CoachesCard/CoachesCard";
import { isLessonFloating, TIME_FORMAT } from "../../../constants/data";
import { format, parseISO } from "date-fns";

const colorScheme = "orange";

export type LessonProfileProps = {
  lessonId: number;
  onUpdate?: () => void;
  onDelete?: () => void;
};

const LessonProfile: React.FC<LessonProfileProps> = (
  props: LessonProfileProps
) => {
  const { t } = useTranslation("common");

  const {
    data: lesson,
    isLoading,
    refetch: refetchLesson,
  } = useGetLessonQuery(props.lessonId);

  const [updateLesson] = useUpdateLessonMutation();
  const [deleteLesson] = useDeleteLessonMutation();

  if (isLoading || !lesson) {
    return null;
  }

  const coaches = lesson.lessonType.coaches;
  const coachesMap = arrayToMap<Coach>(coaches);

  const startDate = parseISO(lesson.startDate);
  const endDate = parseISO(lesson.endDate);

  const toggleCoachOrder = async () => {
    const newCoachOrder: number[] = lesson.coachOrder.length
      ? [...lesson.coachOrder].reverse()
      : coaches.map((coach) => coach.id);

    await updateLesson({ id: lesson.id, coachOrder: newCoachOrder });

    refetchLesson();

    if (props.onUpdate) {
      props.onUpdate();
    }
  };

  const handleDeleteLesson = async () => {
    await deleteLesson(lesson.id);

    if (props.onDelete) {
      props.onDelete();
    }
  };

  let dateLabel = t(`dow:${format(startDate, "E")}`);

  dateLabel += ` ${format(startDate, "dd")}`;
  dateLabel += `, ${format(startDate, TIME_FORMAT)}`;
  dateLabel += ` - ${format(endDate, TIME_FORMAT)}`;

  return (
    <VStack gap="1" alignItems="start">
      <Flex flexDirection="row" gap="3">
        <Text>{dateLabel}</Text>
        <Tag size="sm" variant="outline" colorScheme={colorScheme}>
          <TagLabel>{t(`lessonType:${lesson.lessonType.type}`)}</TagLabel>
        </Tag>
      </Flex>

      <Heading size="sm">{lesson.name}</Heading>

      <CoachesCard
        coaches={coaches}
        coachOrder={lesson.coachOrder}
        lessonType={lesson.lessonType}
        isFloating={isLessonFloating(lesson)}
      >
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={0}
          align="stretch"
          position="relative"
          minW="36"
        >
          {lesson.coachOrder?.length
            ? lesson.coachOrder.map((coachId) => (
                <Box key={coachId} paddingX={4} paddingY={1}>
                  <Text>{t(`coach:${coachesMap[coachId].name}`)}</Text>
                </Box>
              ))
            : coaches.map((coach) => (
                <Box key={coach.id} paddingX={4} paddingY={1}>
                  <Text>{t(`coach:${coach.name}`)}</Text>
                </Box>
              ))}
        </VStack>
        {coaches.length > 1 && (
          <IconButton
            aria-label="next"
            size="sm"
            variant="ghost"
            position="absolute"
            right="5px"
            top="25%"
            icon={<Icon as={FaExchangeAlt} />}
            transform="rotate(90deg)"
            onClick={toggleCoachOrder}
          />
        )}
      </CoachesCard>

      <Divider />
      <Button
        colorScheme="red"
        variant="ghost"
        p={0}
        onClick={handleDeleteLesson}
      >
        {t("Decline lesson")}
      </Button>
    </VStack>
  );
};

export default React.memo(LessonProfile);
