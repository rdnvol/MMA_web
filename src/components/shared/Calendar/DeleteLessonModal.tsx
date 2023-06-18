import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Text,
  Tag,
  TagLabel,
  Flex,
} from "@chakra-ui/react";

import { format } from "date-fns";
import { Event } from "../../../constants/data";
import { minutesToTime } from "../../../utils/calendar";

type DeleteLessonModalProps = {
  event?: Event;
  isOpen?: boolean;
  onCancel?: () => void;
  onSubmit?: () => void;
};

const colorScheme = "orange";

export const DeleteLessonModal: React.FC<DeleteLessonModalProps> = ({
  event,
  isOpen = false,
  onCancel = () => {},
  onSubmit = () => {},
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete lesson?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            {event &&
              `${format(event.date, "E dd")}, ${minutesToTime(
                event.startTime
              )} - ${minutesToTime(event.endTime)}`}
          </Text>
          <Flex flexDirection="row" gap="3">
            <Text>{event?.coaches.join(", ")}</Text>
            <Tag size="sm" variant="outline" colorScheme={colorScheme}>
              <TagLabel>{event?.lessonType}</TagLabel>
            </Tag>
          </Flex>
          <Heading size="sm">{event?.label}</Heading>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button colorScheme="red" mr={3} onClick={onSubmit}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteLessonModal;
