"use client";
import React from "react"; // Import useState, useEffect, useRef
import { MenuItem, TextField, Box, Typography } from "@mui/material"; // Import InputAdornment

import LabeledInput from "../../common/LabeledInput"; // Assuming this is the correct path to LabeledInput

import { DesignParams, Units } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";
import { MaterialName } from "@/utils/materialsData"; // Import MaterialName

type DesignParametersProps = {
  materials: string[];
  material: MaterialName; // Changed type to MaterialName
  designParams: DesignParams;

  onUnitsChange: (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => void;
  onMaterialChange: (value: MaterialName) => void; // Changed type to MaterialName
  onTemperatureChange: (value: number) => void;
  onCAChange: (value: number) => void;
  onDesignPressureChange: (value: number) => void;
};


export default function DesignParameters({
  materials,
  material,
  designParams,
  onMaterialChange,
  onTemperatureChange,
  onCAChange,
  onDesignPressureChange,
}: DesignParametersProps) {
  const { pressure, temperature, corrosionAllowance, allowableStress } =
    designParams;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Design Parameters
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          select
          label="Material"
          value={material}
          onChange={(e) => onMaterialChange(e.target.value as MaterialName)} // Cast value to MaterialName
          sx={{ minWidth: 200, flexGrow: 1 }}
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
          flexDirection: { xs: "column", sm: "row" },
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
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <LabeledInput
          label="Corrosion Allowance"
          symbol="CA"
          unit={unitConversions.length[designParams.units].unit}
          value={corrosionAllowance}
          onChange={onCAChange}
          sx={{ minWidth: 140, flex: 1 }}
          precision={4} // Adjust precision based on units
        />

        <LabeledInput
          label="Allowable Stress"
          symbol="S"
          unit={unitConversions.pressure[designParams.units].unit}
          // Pass the numeric value directly. LabeledInputConversion handles toFixed(2) and "N/A".
          value={allowableStress}
          onChange={() => {}} // Still disabled as it's calculated
          disabled
          sx={{ minWidth: 140, flex: 1 }}
        />
      </Box>
    </Box>
  );
}
