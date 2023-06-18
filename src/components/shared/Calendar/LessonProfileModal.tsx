import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { useTranslation } from "react-i18next";
import LessonProfile from "../LessonProfile/LessonProfile";

type LessonProfileModalProps = {
  lessonId?: number;
  isOpen?: boolean;
  onChange?: () => void;
  onClose?: () => void;
};

export const LessonProfileModal: React.FC<LessonProfileModalProps> = ({
  lessonId,
  isOpen = false,
  onChange = () => {},
  onClose = () => {},
}) => {
  const { t } = useTranslation("common");

  const handleDelete = () => {
    onChange();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Lesson profile")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {lessonId && (
            <LessonProfile
              lessonId={lessonId}
              onUpdate={onChange}
              onDelete={handleDelete}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LessonProfileModal;
