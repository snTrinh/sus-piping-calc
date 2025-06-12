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
      {/* Editable Inputs */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
          justifyContent: "flex-start",
        }}
      >
        <TextField
          select
          label="Material"
          value={material}
          onChange={(e) => onMaterialChange(e.target.value)}
          sx={{ minWidth: 200, flexGrow: 1, flexBasis: "200px" }}
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
          sx={{ minWidth: 140, flexGrow: 1, flexBasis: "140px" }}
        />

        <LabeledInput
          label="Temperature"
          symbol="T"
          unit={unitConversions.temperature[designParams.units].unit}
          value={temperature}
          onChange={onTemperatureChange}
          sx={{ minWidth: 140, flexGrow: 1, flexBasis: "140px" }}
        />

        <LabeledInput
          label="Corrosion Allowance"
          symbol="CA"
          unit={unitConversions.length[designParams.units].unit}
          value={corrosionAllowance}
          onChange={onCAChange}
          sx={{ minWidth: 140, flexGrow: 1, flexBasis: "140px" }}
        />
      </Box>

      {/* Disabled Inputs */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "flex-start",
        }}
      >
        <LabeledInput
          label="Allowable Stress"
          symbol="S"
          unit={unitConversions.pressure[designParams.units].unit}
          value={allowableStress}
          onChange={() => {}}
          disabled
          sx={{ minWidth: 140, flexGrow: 1, flexBasis: "140px" }}
        />

        <LabeledInput
          label="Weld Joint Efficiency"
          symbol="E"
          unit=""
          value={e}
          onChange={() => {}}
          disabled
          sx={{ minWidth: 140, flexGrow: 1, flexBasis: "140px" }}
        />

        <LabeledInput
          label="Weld Strength Reduction Factor"
          symbol="W"
          unit=""
          value={w}
          onChange={() => {}}
          disabled
          sx={{ minWidth: 140, flexGrow: 1, flexBasis: "140px" }}
        />

        <LabeledInput
          label="Temperature Coefficient"
          symbol="γ"
          unit=""
          value={gamma}
          onChange={() => {}}
          disabled
          sx={{ minWidth: 140, flexGrow: 1, flexBasis: "140px" }}
        />

        <LabeledInput
          label="Mill Tolerance"
          symbol=""
          unit=""
          value={millTol}
          onChange={() => {}}
          disabled
          percentage
          sx={{ minWidth: 140, flexGrow: 1, flexBasis: "140px" }}
        />
      </Box>
    </>
  );
}
