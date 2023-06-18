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
  options: string[] | { value: string; label?: string; colorScheme?: string }[];
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
    <Flex gap={2} direction="row" flexWrap="wrap">
      {props.options.map((option) => {
        const label =
          typeof option === "string" ? option : option.label || option.value;
        const value = typeof option === "string" ? option : option.value;
        const colorScheme =
          typeof option === "string" ? props.colorScheme : option.colorScheme;

        const checkbox = getCheckboxProps({ value });

        return (
          <CheckboxCard key={value} {...checkbox} colorScheme={colorScheme}>
            {label}
          </CheckboxCard>
        );
      })}
    </Flex>
  );
};

export default CheckboxGroup;
