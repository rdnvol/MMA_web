import {
  Box,
  HStack,
  useCheckbox,
  useCheckboxGroup,
  UseCheckboxProps,
} from "@chakra-ui/react";
import React from "react";

type CheckboxCardProps = React.PropsWithChildren &
  UseCheckboxProps & {
    colorScheme?: string;
  };

// 1. Create a component that consumes the `useRadio` hook
const CheckboxCard: React.FC<CheckboxCardProps> = (
  props: CheckboxCardProps
) => {
  const { getInputProps, getCheckboxProps } = useCheckbox(props);
  const colorScheme = props.colorScheme || "blue";

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: `${colorScheme}.600`,
          color: "white",
          borderColor: `${colorScheme}.600`,
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export type RadioGroupProps = {
  options: string[];
  value?: string[];
  onChange?: (value: string[]) => void;
  colorScheme?: string;
};

export const CheckboxGroup: React.FC<RadioGroupProps> = (
  props: RadioGroupProps
) => {
  const { getCheckboxProps } = useCheckboxGroup({
    value: props.value,
    onChange: props.onChange,
  });

  return (
    <HStack>
      {props.options.map((value) => {
        const checkbox = getCheckboxProps({ value });

        return (
          <CheckboxCard
            key={value}
            {...checkbox}
            colorScheme={props.colorScheme}
          >
            {value}
          </CheckboxCard>
        );
      })}
    </HStack>
  );
};
