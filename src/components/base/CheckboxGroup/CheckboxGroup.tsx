import {
  Box,
  Flex,
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
        _disabled={{
          color: "gray.300",
          cursor: "not-allowed",
          bg: "gray.100",
          borderColor: `gray.100`,
        }}
        _checked={{
          bg: `${colorScheme}.500`,
          color: "white",
          borderColor: `${colorScheme}.500`,
        }}
        px={5}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export type CheckboxGroupProps = {
  options: number[] | { value: number; label?: string; colorScheme?: string }[];
  value?: number[];
  onChange?: (value: string[]) => void;
  colorScheme?: string;
  isDisabled?: boolean;
};

export const CheckboxGroup: React.FC<CheckboxGroupProps> = (
  props: CheckboxGroupProps
) => {
  const { getCheckboxProps } = useCheckboxGroup({
    value: props.value,
    onChange: props.onChange,
    isDisabled: props.isDisabled,
  });

  return (
    <Flex gap={2} direction="row" flexWrap="wrap">
      {props.options.map((option) => {
        const label =
          typeof option === "number" ? option : option.label || option.value;
        const value = typeof option === "number" ? option : option.value;
        const colorScheme =
          typeof option === "number" || !option.colorScheme
            ? props.colorScheme
            : option.colorScheme;

        const checkbox = getCheckboxProps({ value });

        return (
          <CheckboxCard
            key={value}
            {...checkbox}
            colorScheme={colorScheme}
            isDisabled={props.isDisabled}
          >
            {label}
          </CheckboxCard>
        );
      })}
    </Flex>
  );
};

export default CheckboxGroup;
