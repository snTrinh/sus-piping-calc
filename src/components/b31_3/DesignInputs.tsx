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
  } = designParams;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", 
        gap: 2, 
        width: "100%", 
      }}
    >

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
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
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        <LabeledInput
          label="Design Pressure"
          symbol="P"
          unit={unitConversions.pressure[designParams.units].unit}
          value={pressure}
          onChange={onDesignPressureChange}
          sx={{ minWidth: 140, flex: 1 }} 
        />

        <LabeledInput
          label="Temperature"
          symbol="T"
          unit={unitConversions.temperature[designParams.units].unit}
          value={temperature}
          onChange={onTemperatureChange}
          sx={{ minWidth: 140, flex: 1 }} 
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        <LabeledInput
          label="Corrosion Allowance"
          symbol="CA"
          unit={unitConversions.length[designParams.units].unit}
          value={corrosionAllowance}
          onChange={onCAChange}
          sx={{ minWidth: 140, flex: 1 }} 
        />

        <LabeledInput
          label="Allowable Stress"
          symbol="S"
          unit={unitConversions.pressure[designParams.units].unit}
          value={allowableStress}
          onChange={() => {}}
          disabled
          sx={{ minWidth: 140, flex: 1 }}
        />
      </Box>
    </Box>
  );
}