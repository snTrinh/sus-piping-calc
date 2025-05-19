"use client";
import React from "react";
import { MenuItem, TextField, Box } from "@mui/material";
import LabeledInput from "../common/LabeledInput";
import { DesignParameters, Units } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";

type DesignInputsProps = {
  materials: string[];
  material: string;
  designParams: DesignParameters;

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
  materials,
  material,
  designParams,
  onUnitsChange,
  onMaterialChange,
  onTemperatureChange,
  onCAChange,
  onDesignPressureChange,
}: DesignInputsProps) {
  const {
    pressure,
    temperature,
    corrosionAllowance,
    allowableStress,
    e,
    w,
    gamma,
    millTol,
  } = designParams;
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
          unit={unitConversions.pressure[designParams.units].unit}
          value={pressure}
          onChange={onDesignPressureChange}
        />

        <LabeledInput
          label="Temperature"
          symbol="T"
          unit={unitConversions.temperature[designParams.units].unit}
          value={temperature}
          onChange={onTemperatureChange}
        />

        <LabeledInput
          label="Corrosion Allowance"
          symbol="CA"
          unit={unitConversions.length[designParams.units].unit}
          value={corrosionAllowance}
          onChange={onCAChange}
        />

        <LabeledInput
          label="Allowable Stress"
          symbol="S"
          unit={unitConversions.pressure[designParams.units].unit}
          value={allowableStress}
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
