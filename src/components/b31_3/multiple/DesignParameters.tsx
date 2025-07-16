"use client";
import React from "react";
import { Box, Typography } from "@mui/material"; // Import Typography
import LabeledInput from "../../common/LabeledInputConversion";
import { DesignParams, Units } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";

type DesignParametersProps = {
  materials: string[];
  material: string;
  designParams: DesignParams;

  onUnitsChange: (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => void;
  onMaterialChange: (value: string) => void;
  onTemperatureChange: (value: number) => void;
  onCAChange: (value: number) => void;
  onDesignPressureChange: (value: number) => void;
};

export default function DesignParameters({
  designParams,
  onTemperatureChange,
  onDesignPressureChange,
}: DesignParametersProps) {
  const { pressure, temperature, allowableStress } = designParams;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2, // This gap will now apply between the Typography and the first input Box
        width: "100%", // Ensures this component fills the width of its parent Card
      }}
    >
      {/* Added Title */}
      <Typography variant="h6" gutterBottom>
        Design Parameters
      </Typography>

      {/* Design Pressure & Temperature LabeledInputs - Responsive Flex Direction */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
          flexDirection: { xs: "column", sm: "row" }, // Added responsive flexDirection
        }}
      >
        <LabeledInput
          label="Design Pressure"
          symbol="P"
          unit={unitConversions.pressure[designParams.units].unit}
          value={pressure}
          onChange={onDesignPressureChange}
          sx={{ minWidth: 140, flex: 1 }}
          // Removed type="number" as it is not a valid prop for LabeledInput
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
          flexDirection: { xs: "column", sm: "row" }, // Added responsive flexDirection
        }}
      >
        <LabeledInput
          label="Temperature"
          symbol="T"
          unit={unitConversions.temperature[designParams.units].unit}
          value={temperature}
          onChange={onTemperatureChange}
          sx={{ minWidth: 140, flex: 1 }}
          // type="number" // Re-added for proper arrow key functionality
        />
      </Box>

      {/* Corrosion Allowance (Removed) & Allowable Stress LabeledInputs - Responsive Flex Direction */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
          flexDirection: { xs: "column", sm: "row" }, // Added responsive flexDirection
        }}
      >
        {/*
          The Corrosion Allowance LabeledInput was removed from here.
          If you wish to make the layout visually identical to DesignConstants,
          you might need to re-include it or adjust the styling
          of the remaining Allowable Stress field or its container.
        */}
        <LabeledInput
          label="Allowable Stress"
          symbol="S"
          unit={unitConversions.pressure[designParams.units].unit}
          value={allowableStress}
          onChange={() => {}}
          disabled
          sx={{ minWidth: 140, flex: 1 }}
          // type="number" // Re-added for proper arrow key functionality
        />
      </Box>
    </Box>
  );
}
