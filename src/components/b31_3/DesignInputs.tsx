"use client";
import React from "react";
import { MenuItem, TextField, Box } from "@mui/material";
import LabeledInput from "../common/LabeledInput";
import UnitsToggle from "../common/UnitsToggle";
import { Units } from "@/types/units";

type DesignInputsProps = {
  units: Units;
  materials: string[];
  material: string;
  temperatureDisplay: number;
  stressDisplay: number;
  caDisplay: number;
  pressureDisplay: number;
  pressureUnit: string;
  caUnit: string;
  stressUnit: string;
  tempUnit: string;
  e: number;
  w: number;
  gamma: number;
  millTol: number;

  onUnitsChange: (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => void;
  onMaterialChange: (value: string) => void;
  onTemperatureChange: (value: number) => void;
  onCAChange: (value: number) => void;
  onDesignPressureChange: (value: number) => void;
};

export default function DesignInputs({
  units,
  materials,
  material,
  temperatureDisplay,
  stressDisplay,
  caDisplay,
  pressureDisplay,
  pressureUnit,
  caUnit,
  stressUnit,
  tempUnit,
  e,
  w,
  gamma,
  millTol,
  onUnitsChange,
  onMaterialChange,
  onTemperatureChange,
  onCAChange,
  onDesignPressureChange,
}: DesignInputsProps) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
          justifyContent: "flex-start",
        }}
      >
        <TextField
          select
          label="Material"
          value={material}
          onChange={(e) => onMaterialChange(e.target.value)}
          sx={{ minWidth: 200 }}
          size="small"
        >
          {materials.map((mat) => (
            <MenuItem key={mat} value={mat}>
              {mat}
            </MenuItem>
          ))}
        </TextField>

        <LabeledInput
          label="Design Pressure"
          symbol="P"
          unit={pressureUnit}
          value={pressureDisplay}
          onChange={onDesignPressureChange}
        />

        <LabeledInput
          label="Temperature"
          symbol="T"
          unit={tempUnit}
          value={temperatureDisplay}
          onChange={onTemperatureChange}
        />

        <LabeledInput
          label="Corrosion Allowance"
          symbol="CA"
          unit={caUnit}
          value={caDisplay}
          onChange={onCAChange}
        />

        <LabeledInput
          label="Allowable Stress"
          symbol="S"
          unit={stressUnit}
          value={stressDisplay}
          onChange={() => {}}
          disabled
        />

        <LabeledInput
          label="Weld Joint Efficiency"
          symbol="E"
          unit=""
          value={e}
          onChange={() => {}}
          disabled
        />

        <LabeledInput
          label="Weld Strength Reduction Factor"
          symbol="W"
          unit=""
          value={w}
          onChange={() => {}}
          disabled
        />

        <LabeledInput
          label="Temperature Coefficient"
          symbol="γ"
          unit=""
          value={gamma}
          onChange={() => {}}
          disabled
        />

        <LabeledInput
          label="Mill Tolerance"
          symbol=""
          unit=""
          value={millTol}
          onChange={() => {}}
          disabled
          percentage
        />
      </Box>
    </>
  );
}
