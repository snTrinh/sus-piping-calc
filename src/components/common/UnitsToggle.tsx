import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Units } from "./../../types/units";

type UnitsToggleProps = {
units: Units;
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => void;
};

export default function UnitsToggle({ units, onChange }: UnitsToggleProps) {
  return (
    <ToggleButtonGroup
      value={units}
      exclusive
      onChange={onChange}
      sx={{ mb: 3 }}
    >
      <ToggleButton value={Units.Imperial}>Imperial</ToggleButton>
      <ToggleButton value={Units.Metric}>Metric</ToggleButton>
    </ToggleButtonGroup>
  );
}
