"use client";

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Card, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { Units, DesignParams } from "@/types/units"; // Import DesignParams
import {
  PipeSchedule,
} from "@/utils/unitConversions";
import PipeCard from "../PipeCard";
import FormulaDisplay from "../FormulaDisplay";
import PdfExport from "../pdfExport/PdfExport";
import { MaterialName } from "@/utils/materialsData"; // Import MaterialName
import DesignParameters from "./DesignParameters"; // Assuming this is correct

type Pipe = {
  id: string;
  nps: string;
  od: string;
  schedule: PipeSchedule;
  tRequired: number;
  t: number;
};

// Define props for this component (similar to SinglePressureTabContent)
interface MultiplePressuresTabContentProps {
  // State values
  units: Units;
  material: MaterialName; // Changed type to MaterialName
  temperature: number;
  corrosionAllowance: number;
  pressure: number;
  allowableStress: number | null; // Make sure this is passed if needed for display
  gamma: number;
  millTol: number;
  e: number;
  w: number;
  pipesForDisplay: Pipe[];
  materials: string[]; // This can remain string[] as it's just for the dropdown options
  designParams: DesignParams; // Use the DesignParams type

  // State setters
  setMaterial: (value: MaterialName) => void; // Changed type to MaterialName
  setTemperature: (value: number) => void;
  setCorrosionAllowance: (value: number) => void;
  setPressure: (value: number) => void;
  setPipes: (pipes: Pipe[]) => void;

  // Handlers
  updatePipe: (id: string, key: keyof Pipe, value: string | number) => void;
  removePipe: (id: string) => void;
  handleUnitsChange: (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => void;
  handleTemperatureChange: (value: number) => void;
  handleCAChange: (value: number) => void;
  handleDesignPressureChange: (value: number) => void;
}

const MultiplePressuresTabContent: React.FC<
  MultiplePressuresTabContentProps
> = ({
  units,
  material,
  pipesForDisplay,
  materials,
  designParams,
  setMaterial,
  setPipes,
  updatePipe,
  removePipe,
  handleUnitsChange,
  handleTemperatureChange,
  handleCAChange,
  handleDesignPressureChange,
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "stretch",
          mt: 4,
        }}
      >
        {/* Left Column: Inputs - Corrected to appear only once */}
        <Card
          sx={{
            flex: 1,
            minWidth: 450,
            display: "flex",
            flexDirection: "column",
            p: 2,
            gap: 2,
            height: 305,
            border: "1px solid #ddd",
          }}
          elevation={0}
        >
          {/* Assuming DesignConstants is meant to be DesignParameters based on props */}
          <DesignParameters // Changed from DesignConstants to DesignParameters
            designParams={designParams}
            materials={materials}
            material={material}
            onUnitsChange={handleUnitsChange}
            onMaterialChange={setMaterial}
            onTemperatureChange={handleTemperatureChange}
            onCAChange={handleCAChange}
            onDesignPressureChange={handleDesignPressureChange}
          />

          {/* Button container with marginTop: "auto" to push it to the bottom */}
          <Box sx={{ mt: "auto", width: "100%" }}>
            <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="outlined"
              onClick={() =>
                setPipes([
                  {
                    id: uuidv4(),
                    nps: "2",
                    od: "2.375",
                    schedule: "40",
                    tRequired: 0,
                    t: 0,
                  },
                ])
              }
              fullWidth
            >
              Add Pipe
            </Button>
          </Box>
        </Card>

        {/* Formula Card - Corrected to appear only once */}
        <Card
          sx={{
            flex: 1,
            minWidth: 450,
            display: "flex",
            flexDirection: "column",
            p: 2,
            gap: 2,
            height: 305,
            border: "1px solid #ddd",
          }}
          elevation={0}
        >
          <Typography variant="h6" gutterBottom>
            Formula
          </Typography>
          <FormulaDisplay designParams={designParams} />
        </Card>
      </Box>

      {/* Pipe Cards Display */}
      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        {pipesForDisplay.map((pipe) => (
          <Box
            key={pipe.id} // Important: Key the outer Box for each pipe
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" }, // Two columns on medium screens and up
              gap: 4, // Gap between the two columns
              alignItems: "stretch", // Ensures cards stretch to same height
              // You might want to add margin-bottom here if you need more space between each pipe-row
            }}
          >
            <Card
              sx={{
                flex: 1, // Allows it to take available space
                minWidth: 450, // Ensures it doesn't get too small
                display: "flex",
                flexDirection: "column",
                p: 2,
                gap: 2,
                height: 350, // Ensures content fills card height
                border: "1px solid #ddd",
                alignItems: "stretch",
              }}
              elevation={0}
            >
              <DesignParameters
                designParams={designParams}
                materials={materials}
                material={material}
                onUnitsChange={handleUnitsChange}
                onMaterialChange={setMaterial}
                onTemperatureChange={handleTemperatureChange}
                onCAChange={handleCAChange}
                onDesignPressureChange={handleDesignPressureChange}
              />
            </Card>
            <PipeCard
              pipe={pipe}
              updatePipe={updatePipe}
              removePipe={removePipe}
              units={units}
              sx={{ flex: 1, minWidth: 450 }} // Apply similar flex/minWidth to PipeCard
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 6 }}>
        <PdfExport
          material={material}
          designParams={designParams}
          pipes={pipesForDisplay}
        />
      </Box>
    </>
  );
};

export default MultiplePressuresTabContent;
