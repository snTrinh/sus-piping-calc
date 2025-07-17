// src/app/b31.3-calculator/SinglePressureTabContent.tsx

"use client";

import React from "react"; // Import useEffect
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Card, Typography, CardContent } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {
  PipeSchedule, // Ensure PipeSchedule is imported from unitConversions
} from "@/utils/unitConversions";
import PipeCard from "../PipeCard";
import FormulaDisplay from "../FormulaDisplay";

import PdfExport from "../pdfExport/PdfExport";
import { Units, DesignParams } from "@/types/units"; // Import DesignParams
import { MaterialName } from "@/utils/materialsData"; // Import MaterialName
import DesignParameters from "./DesignParameters";

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
  material: MaterialName; // Changed type to MaterialName
  temperature: number;
  corrosionAllowance: number;
  pressure: number;
  allowableStress: number | null;
  gamma: number;
  millTol: number;
  e: number;
  w: number;
  pipesForDisplay: Pipe[];
  materials: string[]; // This can remain string[] as it's just for the dropdown options
  designParams: DesignParams; // Use the DesignParams type

  setMaterial: (value: MaterialName) => void; // Changed type to MaterialName
  setTemperature: (value: number) => void;
  setCorrosionAllowance: (value: number) => void;
  setPressure: (value: number) => void;
  setAllowableStress: (value: number | null) => void; // Corrected type to allow null
  setPipes: (pipes: Pipe[]) => void;

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

const SinglePressureTabContent: React.FC<SinglePressureTabContentProps> = ({
  material,

  pipesForDisplay,
  materials,
  designParams,
  setMaterial,
  setTemperature, // Destructure setTemperature
  setPipes,
  updatePipe,
  removePipe,
  handleUnitsChange,
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
          justifyContent: "center",
        }}
      >
        {/* Left Column: Inputs Card */}
        <Card
          sx={{
            width: { xs: "100%", md: 584 },
            minWidth: { xs: "auto", md: 450 },
            display: "flex",
            flexDirection: "column",
            height: { xs: "100%", md: 305 },
            border: "1px solid #ddd",
          }}
          elevation={0}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              height: "100%",
              p: 2,
            }}
          >
            <DesignParameters
              designParams={{
                ...designParams,
                allowableStress: designParams.allowableStress ?? 0, // Ensure it's a number for display
              }}
              materials={materials}
              material={material}
              onUnitsChange={handleUnitsChange}
              onMaterialChange={setMaterial}
              onTemperatureChange={setTemperature} // Pass setTemperature directly
              onCAChange={handleCAChange}
              onDesignPressureChange={handleDesignPressureChange}
            />

            <Box sx={{ width: "100%", paddingTop: 1.5 }}>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                variant="outlined"
                onClick={() => {
                  const newPipe: Pipe = {
                    id: uuidv4(),
                    nps: "2",
                    od: "2.375",
                    schedule: "40" as PipeSchedule,
                    tRequired: 0, // Will be calculated by parent's useEffect
                    t: 0, // Will be calculated by parent's useEffect
                  };
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
            width: { xs: "100%", md: 584 },
            minWidth: { xs: "auto", md: 450 },
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

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        {pipesForDisplay.map((pipe) => (
          <PipeCard
            key={pipe.id}
            pipe={pipe}
            updatePipe={updatePipe}
            removePipe={removePipe}
            designParams={designParams} // Pass designParams here
          />
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        <PdfExport
          material={material}
          designParams={{
            ...designParams,
            allowableStress: designParams.allowableStress,
          }}
          pipes={pipesForDisplay}
        />
      </Box>
    </>
  );
};

export default SinglePressureTabContent;
