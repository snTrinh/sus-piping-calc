// src/app/b31.3-calculator/common/LabeledInput.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { TextField, InputAdornment } from "@mui/material";

type LabeledInputConversionProps = {
  label: string;
  symbol?: string;
  unit?: string; // The string for the display unit (e.g., "mm", "in")
  value?: number; // This is the *base unit* value coming from the parent (e.g., always in mm for CA)
  onChange: (value: number) => void; // onChange will return the *base unit* value
  disabled?: boolean;
  step?: number;
  min?: number;
  max?: number;
  sx?: object;
  fullWidth?: boolean;
  percentage?: boolean;
  // These factors are specific to the *current* unit system selected
  conversionFactorFromBase?: number; // Factor to convert *from* the internal base unit *to* the display unit (e.g., mm to in)
  conversionFactorToBase?: number;   // Factor to convert *from* the display unit *to* the internal base unit (e.g., in to mm)
};

export default function LabeledInputConversion({
  label,
  symbol,
  unit,
  value, // This is the base value
  onChange,
  disabled = false,
  step = 0.01,
  min,
  max,
  sx = {},
  fullWidth = false,
  percentage = false,
  conversionFactorFromBase = 1, // Default to 1 if no conversion needed (e.g., base unit is display unit)
  conversionFactorToBase = 1,   // Default to 1
}: LabeledInputConversionProps) {
  // Ref to track if the change originated from user input or prop update
  const isInternalChange = useRef(false);
  // Ref to track the previous 'value' prop to detect external changes
  const prevValueRef = useRef(value);

  // Local state to manage the input field's text.
  // This will primarily store the user's raw input string and will not
  // automatically re-calculate based on unit changes unless the base 'value' itself changes.
  const [inputValue, setInputValue] = useState<string>(() => {
    // Initial formatting based on the incoming base value and the conversion factor
    // This runs only on initial component mount.
    if (value === undefined || value === null || isNaN(value)) return "";
    const displayVal = value * conversionFactorFromBase;
    return percentage ? `${(displayVal * 100).toFixed(2)}` : displayVal.toFixed(2);
  });

  // Effect to re-sync local inputValue with the 'value' prop from parent.
  // This effect will *only* update `inputValue` if the `value` prop (base unit)
  // changes from an external source (not user typing in *this* field).
  // Crucially, it will *not* update `inputValue` if only the `unit` prop changes,
  // thus preserving the user's typed string.
  useEffect(() => {
    // Check if the 'value' prop has genuinely changed from an external source
    // AND it was not a change initiated by the user typing in this field.
    if (value !== prevValueRef.current && !isInternalChange.current) {
      if (value === undefined || value === null || isNaN(value)) {
        setInputValue("");
      } else {
        // When the base 'value' changes, re-calculate the display value
        // based on the *new* base value and the *current* conversion factor.
        const displayVal = value * conversionFactorFromBase;
        setInputValue(percentage ? `${(displayVal * 100).toFixed(2)}` : displayVal.toFixed(2));
      }
    }

    // Reset the internal change flag for the next render cycle.
    isInternalChange.current = false;
    // Update the ref to the current 'value' prop for the next comparison.
    prevValueRef.current = value;
    // Note: The 'unit' prop is intentionally NOT a dependency here,
    // ensuring inputValue doesn't change when only the unit is toggled.
  }, [value, percentage, conversionFactorFromBase]);

  // Handles changes from user typing or arrow key presses
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isInternalChange.current = true; // Set flag to indicate this change originated from user input
    const newValue = e.target.value;
    setInputValue(newValue); // Update local display immediately with the raw input string

    // Attempt to convert the raw input string to a number
    const numericValue = parseFloat(newValue.replace(/[^0-9.-]/g, ""));

    if (!isNaN(numericValue)) {
      // Convert the numeric value from the *current display unit* to the *internal base unit*
      // before calling the parent's onChange handler.
      const baseUnitValue = percentage
        ? (numericValue / 100)
        : (numericValue * conversionFactorToBase);
      onChange(baseUnitValue);
    }
    // If the input is NaN, the parent's state remains unchanged until a valid number is entered or committed on blur.
  };

  // Handles blur event (when input loses focus)
  const handleBlur = () => {
    const numericValue = parseFloat(inputValue.replace(/[^0-9.-]/g, ""));

    if (!isNaN(numericValue)) {
      // Commit the parsed numeric value to the parent, converted to the base unit.
      const baseUnitValue = percentage
        ? (numericValue / 100)
        : (numericValue * conversionFactorToBase);
      onChange(baseUnitValue);
      // Reformat the input value to ensure it's clean (e.g., "12.00" instead of "12.").
      // This re-formats the *user's input* based on its current interpretation.
      setInputValue(percentage ? `${(numericValue * 100).toFixed(2)}` : numericValue.toFixed(2));
    } else {
      // If the final input is not a valid number, revert to the last valid 'value' prop.
      // This ensures the input box always shows a valid, controlled number.
      if (value !== undefined && value !== null && !isNaN(value)) {
        // When reverting, convert the *base value* to the *current display unit* for display.
        const displayVal = value * conversionFactorFromBase;
        setInputValue(percentage ? `${(displayVal * 100).toFixed(2)}` : displayVal.toFixed(2));
      } else {
        setInputValue(""); // If base value is also invalid, clear the input.
      }
    }
    isInternalChange.current = false; // Reset the flag after blur.
  };

  // Handles key down events, specifically for 'Enter' key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur(); // Trigger the same commit logic as blur
      (e.target as HTMLInputElement).blur(); // Optionally blur the input after Enter
    }
  };

  return (
    <TextField
      label={`${label}${symbol ? `, ${symbol}` : ""}${
        unit ? ` (${unit})` : ""
      }`}
      value={inputValue} // Bind TextField to local state
      onChange={handleChange} // Use our custom change handler
      onBlur={handleBlur} // Use our custom blur handler for final commit/revert
      onKeyDown={handleKeyDown} // Use our custom key down handler
      size="small"
      disabled={disabled}
      inputProps={{ step, min, max }} // Pass step, min, max to the native input element
      sx={{
        minWidth: 180,
        ...sx,
        "& input[type=number]::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
        },
      }}
      fullWidth={fullWidth}
      type="number" // Essential for arrow key functionality
    />
  );
}
