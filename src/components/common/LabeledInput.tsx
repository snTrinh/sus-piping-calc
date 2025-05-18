"use client";
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
}: LabeledInputProps) {
  const symbolText = symbol ? `, ${symbol}` : "";
  const unitText = unit ? ` (${unit})` : "";
  const fullLabel = `${label}${symbolText}${unitText}`;

  return (
    <TextField
      label={fullLabel}
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      size="small"
      disabled={disabled}
      inputProps={{ step, min, max }}
      sx={{ minWidth: 180, ...sx }}
    />
  );
}
