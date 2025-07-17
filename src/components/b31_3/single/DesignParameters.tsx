// src/app/b31.3-calculator/components/DesignParameters.tsx
"use client";
import React from "react";
import { MenuItem, TextField, Box, Typography } from "@mui/material";

import LabeledInputConversion from "../../common/LabeledInput"; // Assuming this is the correct path to LabeledInput

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
  // Destructure `units` from designParams to access unit conversion details
  const { pressure, temperature, corrosionAllowance, allowableStress, units } =
    designParams;

  // Get conversion details for each type of unit based on the current `units` system
  // The `unitConversions` object provides `to` and `from` methods to convert
  // between the internal base unit and the selected display unit.
  // We derive the `conversionFactorFromBase` and `conversionFactorToBase` by
  // seeing how a value of `1` is converted.
  const pressureUnitDetails = unitConversions.pressure[units];
  const temperatureUnitDetails = unitConversions.temperature[units];
  const lengthUnitDetails = unitConversions.length[units];

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
          onChange={(e) => onMaterialChange(e.target.value as MaterialName)}
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
        <LabeledInputConversion
          label="Design Pressure"
          symbol="P"
          unit={pressureUnitDetails.unit}
          value={pressure}
          onChange={onDesignPressureChange}
          // Derive conversion factors using the 'to' and 'from' methods
          conversionFactorFromBase={pressureUnitDetails.to(1)} // How many display units in 1 base unit
          conversionFactorToBase={pressureUnitDetails.from(1)} // How many base units in 1 display unit
          sx={{ minWidth: 140, flex: 1 }}
        />

        <LabeledInputConversion
          label="Temperature"
          symbol="T"
          unit={temperatureUnitDetails.unit}
          value={temperature}
          onChange={onTemperatureChange}
          // Derive conversion factors using the 'to' and 'from' methods
          conversionFactorFromBase={temperatureUnitDetails.to(1)}
          conversionFactorToBase={temperatureUnitDetails.from(1)}
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
        <LabeledInputConversion
          label="Corrosion Allowance"
          symbol="CA"
          unit={lengthUnitDetails.unit}
          value={corrosionAllowance} // This remains the base unit value (e.g., in mm)
          onChange={onCAChange} // This expects a base unit value (e.g., in mm)
          // Derive conversion factors using the 'to' and 'from' methods
          conversionFactorFromBase={lengthUnitDetails.to(1)}
          conversionFactorToBase={lengthUnitDetails.from(1)}
          sx={{ minWidth: 140, flex: 1 }}
        />

        <LabeledInputConversion
          label="Allowable Stress"
          symbol="S"
          unit={pressureUnitDetails.unit}
          value={allowableStress}
          onChange={() => {}} // Still disabled as it's calculated
          disabled
          // Derive conversion factors using the 'to' and 'from' methods
          conversionFactorFromBase={pressureUnitDetails.to(1)}
          conversionFactorToBase={pressureUnitDetails.from(1)}
          sx={{ minWidth: 140, flex: 1 }}
        />
      </Box>
    </Box>
  );
}
