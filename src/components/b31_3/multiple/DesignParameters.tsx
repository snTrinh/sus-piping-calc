"use client";
import React, { useState, useEffect, useRef } from "react"; // Import useState, useEffect, useRef
import { MenuItem, TextField, Box, Typography, InputAdornment } from "@mui/material"; // Import InputAdornment

import LabeledInputConversion from "../../common/LabeledInput"; // Assuming this is the correct path to LabeledInput

import { DesignParams, Units } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";
import { MaterialName } from "@/utils/materialsData"; // Import MaterialName
import LabeledInput from "../../common/LabeledInput";

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

  // --- Local state for the second Design Pressure TextField ---
  const [localPressureInput, setLocalPressureInput] = useState(
    pressure !== null && !isNaN(pressure) ? pressure.toFixed(2) : ""
  );
  const isPressureInputFocused = useRef(false);

  // Effect to synchronize localPressureInput with the `pressure` prop
  // This runs when `pressure` (from designParams.pressureDisplay) changes,
  // but only if the input field is not currently focused.
  useEffect(() => {
    if (!isPressureInputFocused.current) {
      setLocalPressureInput(
        pressure !== null && !isNaN(pressure) ? pressure.toFixed(2) : ""
      );
    }
  }, [pressure]);

  // Handlers for the second Design Pressure TextField
  const handleLocalPressureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    setLocalPressureInput(rawInput); // Update local string state immediately

    const numericValue = parseFloat(rawInput);
    if (!isNaN(numericValue)) {
      onDesignPressureChange(numericValue); // Pass the numerical value (in display units) up
    }
    // If NaN, parent's state remains unchanged until valid input or blur
  };

  const handleLocalPressureBlur = () => {
    isPressureInputFocused.current = false;
    const numericValue = parseFloat(localPressureInput);
    if (!isNaN(numericValue)) {
      onDesignPressureChange(numericValue); // Commit the value
      setLocalPressureInput(numericValue.toFixed(2)); // Re-format for clean display
    } else {
      // Revert to last valid prop value if input is invalid on blur
      setLocalPressureInput(
        pressure !== null && !isNaN(pressure) ? pressure.toFixed(2) : ""
      );
    }
  };

  const handleLocalPressureFocus = () => {
    isPressureInputFocused.current = true;
  };

  const handleLocalPressureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLocalPressureBlur(); // Trigger blur logic on Enter
      (e.target as HTMLInputElement).blur(); // Optionally blur the input
    }
  };
  // --- End Local state for the second Design Pressure TextField ---


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
        <LabeledInputConversion
          label="Design Pressure"
          symbol="P"
          unit={unitConversions.pressure[designParams.units].unit}
          value={pressure}
          onChange={onDesignPressureChange}
          sx={{ minWidth: 140, flex: 1 }}
        />

        <LabeledInputConversion
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
        <LabeledInputConversion
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
