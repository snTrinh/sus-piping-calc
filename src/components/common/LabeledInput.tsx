"use client";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";

type LabeledInputProps = {
  label: string;
  symbol?: string;
  unit?: string;
  value: number;
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
  step = 0.01,
  min,
  max,
  sx = {},
  fullWidth = false,
  percentage = false,
}: LabeledInputProps) {
  const formatValue = (val: number) =>
    percentage ? `${(val * 100).toFixed(2)}%` : val.toString();

  const [inputValue, setInputValue] = useState(formatValue(value));

  useEffect(() => {
    setInputValue(formatValue(value));
  }, [value, percentage]);

  const commitChange = () => {
    const numeric = parseFloat(inputValue.replace(/[^0-9.-]/g, ""));
    if (!isNaN(numeric)) {
      onChange(percentage ? numeric / 100 : numeric);
    } else {
      setInputValue(formatValue(value)); // revert to previous valid value
    }
  };

  return (
    <TextField
      label={`${label}${symbol ? `, ${symbol}` : ""}${unit ? ` (${unit})` : ""}`}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={commitChange}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          commitChange();
          (e.target as HTMLInputElement).blur();
        }
      }}
      size="small"
      disabled={disabled}
      inputProps={{ step, min, max }}
      sx={{ minWidth: 180, ...sx }}
      fullWidth={fullWidth}
    />
  );
}
