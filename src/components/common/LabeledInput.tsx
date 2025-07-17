// src/app/b31.3-calculator/common/LabeledInput.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { TextField} from "@mui/material";

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
  precision?: number;
  conversionFactorFromBase?: number;
  conversionFactorToBase?: number;
};

export default function LabeledInputConversion({
  label,
  symbol,
  unit,
  value,
  onChange,
  disabled = false,
  step = 0.01,
  min,
  max,
  sx = {},
  fullWidth = false,
  percentage = false,
  precision = 2,
  conversionFactorFromBase = 1,
  conversionFactorToBase = 1,
}: LabeledInputProps) {
  // HIGHLIGHT START
  const inputRef = useRef<HTMLInputElement>(null); // Ref to the actual input element
  // HIGHLIGHT END

  const formatDisplayValue = (val: number | undefined | null): string => {
    if (val === undefined || val === null || isNaN(val)) return "";
    const displayVal = val * conversionFactorFromBase;
    return percentage ? `${(displayVal * 100).toFixed(2)}` : displayVal.toFixed(precision);
  };

  const [inputValue, setInputValue] = useState<string>(() => formatDisplayValue(value));

  useEffect(() => {
    // HIGHLIGHT START
    // Only update inputValue from prop if the input is not currently focused
    // This prevents reformatting while the user is actively typing
    if (inputRef.current && document.activeElement !== inputRef.current) {
      setInputValue(formatDisplayValue(value));
    }
    // HIGHLIGHT END
  }, [value, percentage, precision, conversionFactorFromBase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const numericValue = parseFloat(newValue.replace(/[^0-9.-]/g, ""));

    if (!isNaN(numericValue)) {
      const baseUnitValue = percentage
        ? (numericValue / 100)
        : (numericValue * conversionFactorToBase);
      onChange(baseUnitValue);
    }
  };

  const handleBlur = () => {
    const numericValue = parseFloat(inputValue.replace(/[^0-9.-]/g, ""));

    if (!isNaN(numericValue)) {
      const baseUnitValue = percentage
        ? (numericValue / 100)
        : (numericValue * conversionFactorToBase);
      onChange(baseUnitValue);
      setInputValue(formatDisplayValue(numericValue / conversionFactorToBase));
    } else {
      if (value !== undefined && value !== null && !isNaN(value)) {
        setInputValue(formatDisplayValue(value));
      } else {
        setInputValue("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
      // HIGHLIGHT START
      inputRef.current?.blur(); // Explicitly blur the input
      // HIGHLIGHT END
    }
  };

  return (
    <TextField
      label={`${label}${symbol ? `, ${symbol}` : ""}${
        unit ? ` (${unit})` : ""
      }`}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      size="small"
      disabled={disabled}
      inputProps={{ step, min, max }}
      sx={{
        minWidth: 180,
        ...sx,
        "& input[type=number]::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
        },
      }}
      fullWidth={fullWidth}
      type="number"
      InputLabelProps={{ shrink: true }}
      // HIGHLIGHT START
      inputRef={inputRef} // Attach ref to the input element
      // HIGHLIGHT END
    />
  );
}
