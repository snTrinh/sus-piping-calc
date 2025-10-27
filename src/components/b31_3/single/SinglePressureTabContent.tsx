"use client";

import React from "react"; 
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Card, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {
  PipeSchedule, 
} from "@/utils/unitConversions";
import PipeCard from "../PipeCard";
import FormulaDisplay from "../FormulaDisplay";

import PdfExport from "../pdfExport/SinglePressure/PdfExport";
import { Units, DesignParams } from "@/types/units"; 
import { MaterialName } from "@/utils/materialsData"; 
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
  material: MaterialName; 
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
  designParams: DesignParams; 

  setMaterial: (value: MaterialName) => void; 
  setTemperature: (value: number) => void;
  setCorrosionAllowance: (value: number) => void;
  setPressure: (value: number) => void;
  setAllowableStress: (value: number | null) => void; // 
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
  setTemperature, 
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
          mt: 4,
        }}
      >

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
            <DesignParameters
              designParams={{
                ...designParams,
                allowableStress: designParams.allowableStress ?? 0,
              }}
              materials={materials}
              material={material}
              onUnitsChange={handleUnitsChange}
              onMaterialChange={setMaterial}
              onTemperatureChange={setTemperature} 
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
                    tRequired: 0, 
                    t: 0, 
                  };
                  setPipes([...pipesForDisplay, newPipe]);
                }}
                fullWidth
              >
                Add Pipe
              </Button>
            </Box>
          
        </Card>

        <Card
          sx={{
            flex: 1,
            maxWidth: {  md: 650 },
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
