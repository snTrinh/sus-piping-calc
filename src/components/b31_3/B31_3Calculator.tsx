"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import { materialStressLookup } from "./../../utils/materialStressLookup";
import stressData from "@/data/stressValues.json";
import thicknessByNpsSchedule from "@/data/thicknessByNpsSchedule.json";
import pipeData from "./../../utils/pipeData.json";
import PipeCard from "./PipeCard";
import PdfExport from "./PdfExport";
import UnitsToggle from "./../common/UnitsToggle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LabeledInput from "../common/LabeledInput";
import { Units } from "@/types/units";
import {
  convertDesignInputs,
  PipeSchedule,
  ThicknessData,
} from "@/utils/unitConversions";
import FormulaDisplay from "./FormulaDisplay";
import DesignInputs from "./DesignInputs";

type Pipe = {
  id: string;
  nps: string;
  schedule: PipeSchedule;
  tRequired: number;
  t: number;
};
type PipeThicknessInfo = {
  nps: string;
  schedule: string;
  thickness: number;
};

export default function B31_3Calculator() {
  const [units, setUnits] = useState<Units>(Units.Imperial);

  const [material, setMaterial] = useState("A333-6");
  const [temperature, setTemperature] = useState(100); // °F internally
  const [stress, setStress] = useState(
    materialStressLookup(units, "A312TP316L", temperature)
  ); // psi internally
  const [ca, setCA] = useState(0); // inches

  // New variables for the formula
  const [e, setE] = useState(1); // Weld joint efficiency
  const [w, setW] = useState(1); // Weld strength reduction factor
  const [gamma, setGamma] = useState(0.4); // Gamma coefficient
  const [millTol, setMillTol] = useState(0.125); // Gamma coefficient
  const [designPressure, setDesignPressure] = useState(1414); // psi

  const [pipes, setPipes] = useState<Pipe[]>([
    {
      id: uuidv4(),
      nps: "4",
      schedule: "40",
      tRequired: 0,
      t: 0,
    },
  ]);

  // Update stress based on material and temperature
  useEffect(() => {
    const match = stressData.find(
      (item) => item.material === material && item.temp === temperature
    );
    if (match) setStress(match.stress);
  }, [material, temperature]);

  // Calculate thickness with new formula
  useEffect(() => {
    setPipes((prev) =>
      prev.map((pipe) => {
        const diameterInches = Number(pipe.nps);
        const numerator = designPressure * diameterInches;
        const denominator =
          2 * ((stress ?? 0) * e * w + designPressure * gamma);
        const tRequired = denominator !== 0 ? numerator / denominator + ca : 0;

        return { ...pipe, tRequired };
      })
    );
  }, [designPressure, stress, e, w, gamma, ca]);

  // Units toggle - only update label state, no conversion of values
  const handleUnitsChange = (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => {
    if (!newUnits || newUnits === units) return;
    setUnits(newUnits);
  };

  // Handlers - just set value as entered, no conversions
  const handleTemperatureChange = (value: number) => {
    setTemperature(value);
  };

  const handleCAChange = (value: number) => {
    setCA(value);
  };

  const handleDesignPressureChange = (value: number) => {
    setDesignPressure(value);
  };

  const updatePipe = (id: string, key: keyof Pipe, value: any) => {
    setPipes((prev) =>
      prev.map((pipe) => (pipe.id === id ? { ...pipe, [key]: value } : pipe))
    );
  };

  // No conversion on tRequired for display — show internal value as is
  const pipesForDisplay = pipes.map((pipe) => ({ ...pipe }));

  // Material list for select options
  const materials = [...new Set(stressData.map((d) => d.material))];

  // Use convertDesignInputs only for label display, not for actual values
  const { temperatureDisplay, stressDisplay, caDisplay, pressureDisplay } =
    convertDesignInputs({
      units,
      temperature,
      stress: stress ?? 0,
      ca,
      designPressure,
    });

  const designParams = {
    units,
    pressure: pressureDisplay,
    temperature: temperatureDisplay,
    corrosionAllowance: caDisplay,
    allowableStress: stressDisplay,
    gamma,
    millTol,
    e,
    w,
  };

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
        B31.3 Pipe Thickness Calculator
      </Typography>

      <UnitsToggle units={units} onChange={handleUnitsChange} />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
          justifyContent: "flex-start",
        }}
      >
        <DesignInputs
          designParams={designParams}
          materials={materials}
          material={material}
          onUnitsChange={handleUnitsChange}
          onMaterialChange={setMaterial}
          onTemperatureChange={handleTemperatureChange}
          onCAChange={handleCAChange}
          onDesignPressureChange={handleDesignPressureChange}
        />
      </Box>
      <FormulaDisplay />

      <Button
        startIcon={<AddCircleOutlineIcon />}
        variant="outlined"
        onClick={() => {
          setPipes((prev) => [
            ...prev,
            {
              id: uuidv4(),
              nps: "2",
              schedule: "40",
              tRequired: 0,
              t: 0,
            },
          ]);
        }}
        sx={{ mb: 4 }}
      >
        Add Pipe
      </Button>

      {pipesForDisplay.map((pipe) => (
        <PipeCard
          key={pipe.id}
          pipe={pipe}
          thicknessByNpsSchedule={thicknessByNpsSchedule}
          updatePipe={updatePipe}
          removePipe={(id) => {
            setPipes((prev) => prev.filter((p) => p.id !== id));
          }}
          units={units}
        />
      ))}

      <PdfExport
        material={material}
        designParams={designParams}
        pipes={pipesForDisplay}
      />
    </Container>
  );
}
