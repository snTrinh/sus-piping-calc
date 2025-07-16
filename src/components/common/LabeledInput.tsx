// src/app/b31.3-calculator/common/LabeledInput.tsx
"use client";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";

type LabeledInputProps = {
  label: string;
  symbol?: string;
  unit?: string;
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  step?: number;
  min?: number;
  max?: number;
  sx?: object;
  fullWidth?: boolean;
  percentage?: boolean;
};

export default function LabeledInput({
  label,
  symbol,
  unit,
  value,
  onChange,
  disabled = false,
  step = 0.01, // Default to 1 for arrow key increments
  min,
  max,
  sx = {},
  fullWidth = false,
  percentage = false,
}: LabeledInputProps) {
  // Helper to format the value for display
  const formatValue = (val: number | undefined) =>
    percentage ? `${((val ?? 0) * 100).toFixed(2)}%` : (val ?? 0).toString();

  // Local state to manage the input field's text, allowing for partial/invalid input temporarily
  const [inputValue, setInputValue] = useState(formatValue(value ?? 0));

  // Effect to re-sync local inputValue with the 'value' prop from parent
  // This is crucial if the parent updates 'value' from other sources or after an initial commit.
  useEffect(() => {
    // Only update if the current input value isn't actively being edited to avoid cursor jumps
    // A more robust check might be needed for production, but this is a good start.
    if (parseFloat(inputValue) !== value) {
      // Simple check to prevent unnecessary re-renders during active typing
      setInputValue(formatValue(value ?? 0));
    }
  }, [value, percentage]);

  // Handles changes from user typing or arrow key presses
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue); // Update local display immediately

    // Attempt to convert to number and propagate change to parent
    const numericValue = parseFloat(newValue.replace(/[^0-9.-]/g, ""));

    // Only call parent's onChange if it's a valid number.
    // This allows intermediate invalid states (e.g., "12.") in the input field
    // without breaking the parent's numerical state.
    if (!isNaN(numericValue)) {
      onChange(percentage ? numericValue / 100 : numericValue);
    }
    // If it's NaN, the parent's state remains unchanged until a valid number is entered or committed on blur.
  };

  // Handles blur event (when input loses focus)
  const handleBlur = () => {
    const numericValue = parseFloat(inputValue.replace(/[^0-9.-]/g, ""));

    if (!isNaN(numericValue)) {
      // Commit the parsed numeric value to the parent
      onChange(percentage ? numericValue / 100 : numericValue);
    } else {
      // If the final input is not a valid number, revert to the last valid 'value' prop
      // This ensures the input box always shows a valid, controlled number
      setInputValue(formatValue(value ?? 0));
      // No need to call onChange here as the value is reverting to the existing parent state
    }
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
