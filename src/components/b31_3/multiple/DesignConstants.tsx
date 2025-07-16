"use client";
import React from "react";
import { MenuItem, TextField, Box, Typography } from "@mui/material"; // Import Typography
import LabeledInput from "../../common/LabeledInput";
import { DesignParams, Units } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";

type DesignConstantsProps = {
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

export default function DesignConstants({
  materials,
  material,
  designParams,
  onMaterialChange,
  onCAChange,
}: DesignConstantsProps) {
  const { corrosionAllowance } = designParams;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2, // This gap will now apply between the Typography and the first input Box
        width: "100%",
      }}
    >
      {/* Added Title */}
      <Typography variant="h6" gutterBottom>
        Design Parameters
      </Typography>

      {/* Material TextField - Responsive Flex Direction */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "flex-start",
          flexDirection: { xs: "column", sm: "row" }, // Added responsive flexDirection
        }}
      >
        <TextField
          select
          label="Material"
          value={material}
          onChange={(e) => onMaterialChange(e.target.value)}
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

      {/* Corrosion Allowance & Allowable Stress LabeledInputs - Responsive Flex Direction */}
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
          label="Corrosion Allowance"
          symbol="CA"
          unit={unitConversions.length[designParams.units].unit}
          value={corrosionAllowance}
          onChange={onCAChange}
          sx={{ minWidth: 140, flex: 1 }}
        />
      </Box>
    </Box>
  );
}
