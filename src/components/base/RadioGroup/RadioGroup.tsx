import {
  Box,
  Flex,
  useRadio,
  useRadioGroup,
  UseRadioProps,
} from "@chakra-ui/react";
import React from "react";

type RadioCardProps = React.PropsWithChildren &
  UseRadioProps & {
    colorScheme?: string;
  };

// 1. Create a component that consumes the `useRadio` hook
const RadioCard: React.FC<RadioCardProps> = (props: RadioCardProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);
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

export type RadioGroupProps = {
  options:
    | string[]
    | {
        value: string;
        label?: string;
        colorScheme?: string;
        isDisabled?: boolean;
      }[];
  value?: string;
  onChange?: (value: string) => void;
  colorScheme?: string;
  isDisabled?: boolean;
};

export const RadioGroup: React.FC<RadioGroupProps> = (
  props: RadioGroupProps
) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    value: props.value,
    onChange: props.onChange,
    isDisabled: props.isDisabled,
  });

  const group = getRootProps();

  return (
    <Flex {...group} gap={2} direction="row" flexWrap="wrap">
      {props.options.map((option) => {
        const label =
          typeof option === "string" ? option : option.label || option.value;
        const value = typeof option === "string" ? option : option.value;
        const colorScheme =
          typeof option === "string" || !option.colorScheme
            ? props.colorScheme
            : option.colorScheme;
        const isDisabled =
          typeof option === "string" ? props.isDisabled : option.isDisabled;

        const radio = getRadioProps({ value });

        return (
          <RadioCard
            key={value}
            {...radio}
            colorScheme={colorScheme}
            isDisabled={isDisabled}
          >
            {label}
          </RadioCard>
        );
      })}
    </Flex>
  );
};

export default RadioGroup;
