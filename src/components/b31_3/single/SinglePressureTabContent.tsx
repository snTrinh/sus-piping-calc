"use client";

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Card, Typography, CardContent } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {
  PipeSchedule, // Ensure PipeSchedule is imported from unitConversions
} from "@/utils/unitConversions";
import PipeCard from "../PipeCard";
import FormulaDisplay from "../FormulaDisplay";
import DesignInputs from "./DesignParameters";
import PdfExport from "../pdfExport/PdfExport";
import { Units } from "@/types/units";

type Pipe = {
  id: string;
  nps: string;
  od: string;
  schedule: PipeSchedule;
  tRequired: number;
  t: number;
};

interface SinglePressureTabContentProps {
  units: Units;
  material: string;
  temperature: number;
  corrosionAllowance: number;
  pressure: number;
  allowableStress: number | null;
  gamma: number;
  millTol: number;
  e: number;
  w: number;
  pipesForDisplay: Pipe[];
  materials: string[];
  designParams: {
    units: Units;
    pressure: number;
    temperature: number;
    corrosionAllowance: number;
    allowableStress: number | null;
    gamma: number;
    millTol: number;
    e: number;
    w: number;
  };

  setMaterial: (value: string) => void;
  setTemperature: (value: number) => void;
  setCorrosionAllowance: (value: number) => void;
  setPressure: (value: number) => void;
  setPipes: (pipes: Pipe[]) => void;

  updatePipe: (id: string, key: keyof Pipe, value: string | number) => void; // Corrected type for key and value
  removePipe: (id: string) => void;
  handleUnitsChange: (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => void;
  handleTemperatureChange: (value: number) => void;
  handleCAChange: (value: number) => void;
  handleDesignPressureChange: (value: number) => void;
}

const SinglePressureTabContent: React.FC<SinglePressureTabContentProps> = ({
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
          alignItems: "stretch", // Ensures cards stretch to the same height
          justifyContent: "center", // Center the cards horizontally on larger screens
          mt: 4,
        }}
      >
        {/* Left Column: Inputs Card */}
        <Card
          sx={{
            // Removed flex: 1 to allow fixed width
            width: { xs: "100%", md: 584 }, // Set width to 539px on desktop, full width on smaller screens
            minWidth: { xs: "auto", md: 450 }, // Keep minWidth for smaller desktop sizes if needed, or adjust
            display: "flex",
            flexDirection: "column",
            height: 305, // Fixed height for consistent alignment
            border: "1px solid #ddd",
          }}
          elevation={0}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2, // Ensures 16px gap between DesignInputs and the button
              height: "100%",
              p: 2, // Provides 16px padding on all sides, including the bottom
            }}
          >
            <DesignInputs
              designParams={{
                ...designParams,
                allowableStress: designParams.allowableStress ?? 0,
              }}
              materials={materials}
              material={material}
              onUnitsChange={handleUnitsChange}
              onMaterialChange={setMaterial}
              onTemperatureChange={handleTemperatureChange}
              onCAChange={handleCAChange}
              onDesignPressureChange={handleDesignPressureChange}
            />

            {/* Button container now directly follows DesignInputs */}
            <Box sx={{ width: "100%", paddingTop:1.5 }}>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                variant="outlined"
                onClick={() => {
                  // Create the new pipe object
                  const newPipe: Pipe = { // Explicitly type newPipe as Pipe
                    id: uuidv4(),
                    nps: "2",
                    od: "2.375",
                    schedule: "40" as PipeSchedule, // Explicitly cast to PipeSchedule
                    tRequired: 0,
                    t: 0,
                  };
                  // Pass the new array directly to setPipes
                  setPipes([...pipesForDisplay, newPipe]);
                }}
                fullWidth
              >
                Add Pipe
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Formula Card */}
        <Card
          sx={{
            // Removed flex: 1 to allow fixed width
            width: { xs: "100%", md: 584 }, // Set width to 539px on desktop, full width on smaller screens
            minWidth: { xs: "auto", md: 450 }, // Keep minWidth for smaller desktop sizes if needed, or adjust
            display: "flex",
            flexDirection: "column",
            p: 2,
            gap: 2,
            height: 305, // Fixed height for consistent alignment
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

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        {pipesForDisplay.map((pipe) => (
          <PipeCard
            key={pipe.id}
            pipe={pipe}
            updatePipe={updatePipe}
            removePipe={removePipe}
            units={units}
          />
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        <PdfExport
          material={material}
          designParams={{
            ...designParams,
            allowableStress: designParams.allowableStress ?? 0,
          }}
          pipes={pipesForDisplay}
        />
      </Box>
    </>
  );
};

export default SinglePressureTabContent;