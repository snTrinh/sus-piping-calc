import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export type Units = "imperial" | "metric";

type UnitsToggleProps = {
  units: Units;
  onChange: (event: React.MouseEvent<HTMLElement>, newUnits: Units | null) => void;
};

export default function UnitsToggle({ units, onChange }: UnitsToggleProps) {
  return (
    <ToggleButtonGroup value={units} exclusive onChange={onChange} sx={{ mb: 3 }}>
      <ToggleButton value="imperial">Imperial</ToggleButton>
      <ToggleButton value="metric">Metric</ToggleButton>
    </ToggleButtonGroup>
  );
}
