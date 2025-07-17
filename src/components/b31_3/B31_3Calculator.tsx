"use client";
import React, { useEffect, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Typography, Container, Tabs, Tab } from "@mui/material";
import { materialsData, MaterialName } from "./../../utils/materialsData";
import { Units } from "@/types/units";
import {
  convertDesignInputs,
  npsToMmMap,
  PipeSchedule,
  unitConversions,
} from "@/utils/unitConversions";

// NEW: Interfaces for transformed_pipeData.json
interface ScheduleThicknesses {
  [key: string]: number | null;
}

interface PipeSizeData {
  OD: number;
  schedules: ScheduleThicknesses;
}

interface TransformedPipeData {
  Metric: {
    [key: string]: PipeSizeData;
  };
  Imperial: {
    [key: string]: PipeSizeData;
  };
}

// Cast pipeData to the new interface type
import rawPipeData from "@/data/transformed_pipeData.json"; // Renamed to rawPipeData to avoid conflict
const typedPipeData: TransformedPipeData = rawPipeData as TransformedPipeData;

import SinglePressureTabContent from "./single/SinglePressureTabContent";
import MultiplePressuresTabContent from "./multiple/MultiplePressuresTabContent";
import UnitsToggle from "../common/UnitsToggle";
import { materialStress } from "@/utils/materialStress";
import { calculateTRequired } from "@/utils/pipeCalculations"; // Import the new calculation function

type Pipe = {
  id: string;
  nps: string;
  od: string; // This will actually be the NPS key (e.g., "4" or "100") not OD itself
  schedule: PipeSchedule;
  tRequired: number;
  t: number; // Actual schedule thickness
};

export default function B31_3Calculator() {
  const [units, setUnits] = useState<Units>(Units.Imperial);
  const [material, setMaterial] = useState<MaterialName>("A106B");
  const [temperature, setTemperature] = useState(100); // °F internally
  const [allowableStress, setAllowableStress] = useState<number | null>(null);
  const [corrosionAllowance, setCorrosionAllowance] = useState(0); // inches

  const [e, setE] = useState(1);
  const [w, setW] = useState(1); // W factor
  const [gamma, setGamma] = useState(0.4); // Y factor
  const [millTol, setMillTol] = useState(0.125); // Corrected to 12.5% (0.125)

  const [pressure, setPressure] = useState(1414); // psi

  const [pipes, setPipes] = useState<Pipe[]>([
    {
      id: uuidv4(),
      nps: "4",
      od: "4.5", // This `od` here is likely meant to be the display value, not the internal key.
      schedule: "40",
      tRequired: 0,
      t: 0,
    },
  ]);

  const [tabIndex, setTabIndex] = useState(0);

  // Effect to automatically calculate allowableStress on relevant input changes
  useEffect(() => {
    const category = units === Units.Imperial ? "Imperial" : "Metric";
    const stress = materialStress(
      category,
      material,
      temperature,
      units // Pass the current units state as the fourth argument
    );

    if (stress !== allowableStress) {
      setAllowableStress(stress);
    }

    if (stress === null) {
      console.warn(
        `Could not determine allowable stress for material: ${material}, temperature: ${temperature}, units: ${units}. Please check inputs and data range.`
      );
    }
  }, [units, material, temperature, allowableStress, setAllowableStress]);

  // Handlers
  const handleUnitsChange = (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => {
    if (!newUnits || newUnits === units) return;
    setUnits(newUnits);
  };

  const handleTemperatureChange = (value: number) => {
    const convertedValue = unitConversions.temperature[units].toImperial(value);
    setTemperature(convertedValue);
  };

  const handleCAChange = (value: number) => {
    const convertedValue = unitConversions.length[units].toImperial(value);
    setCorrosionAllowance(convertedValue);
  };

  const handleDesignPressureChange = (value: number) => {
    const convertedValue = unitConversions.pressure[units].toImperial(value);
    setPressure(convertedValue);
  };

  const updatePipe = (id: string, key: keyof Pipe, value: string | number) => {
    setPipes((prev) =>
      prev.map((pipe) => (pipe.id === id ? { ...pipe, [key]: value } : pipe))
    );
  };

  const removePipe = (id: string) => {
    setPipes((prev) => prev.filter((p) => p.id !== id));
  };

  // Derived states and props to pass down using useMemo for optimization
  const pipesForDisplay = useMemo(
    () =>
      pipes.map((pipe) => {
        // `pipe.nps` is the string like "4" or "1/2"
        // `npsToMmMap` helps convert "1/2" to "15" for metric lookup
        const currentNpsKey =
          units === Units.Metric ? npsToMmMap[pipe.nps]?.toString() : pipe.nps;

        // Corrected way to get pipe size data from the transformed_pipeData.json structure
        const selectedPipeSizeData = typedPipeData[units]?.[currentNpsKey || ''];

        // Retrieve Outer Diameter
        const outerDiameter = selectedPipeSizeData?.OD || 0;

        // Convert OD to Imperial inches for calculation (as formula expects Imperial)
        // unitConversions.length[units].toImperial will handle "mm" to "inches" for metric,
        // and just return the value for imperial.
        const outerDiameterInches = unitConversions.length[units].toImperial(
          outerDiameter
        );

        // --- Start Debugging Logs for tRequired inputs ---
        console.log(`--- Pipe: ${pipe.nps}, Schedule: ${pipe.schedule} ---`);
        console.log("Calculated OD in Inches (outerDiameterInches):", outerDiameterInches);
        console.log("Design Pressure (pressure):", pressure);
        console.log("Allowable Stress (allowableStress):", allowableStress);
        console.log("E Factor (e):", e);
        console.log("W Factor (w):", w);
        console.log("Y Factor (gamma):", gamma);
        console.log("Corrosion Allowance (corrosionAllowance):", corrosionAllowance);
        console.log("Mill Tolerance (millTol):", millTol);
        // --- End Debugging Logs ---

        const calculatedTRequired = calculateTRequired({
          pressure, // Already in psi
          outerDiameterInches,
          allowableStress,
          e,
          w,
          gamma,
          corrosionAllowanceInches: corrosionAllowance, // Already in inches
          millTol,
        });

        // Calculate actual schedule thickness (pipe.t)
        // This value is stored in Imperial inches in transformed_pipeData.json
        const rawScheduleThicknessImperial = selectedPipeSizeData?.schedules[
          pipe.schedule
        ] ?? 0;

        console.log("Final calculatedTRequired:", calculatedTRequired);
        console.log("Raw Schedule Thickness (Imperial):", rawScheduleThicknessImperial);
        console.log("---------------------------------------");

        return {
          ...pipe,
          tRequired: calculatedTRequired,
          t: rawScheduleThicknessImperial, // Store actual thickness in Imperial inches
        };
      }),
    [
      pipes,
      units,
      pressure,
      allowableStress,
      e,
      w,
      gamma,
      corrosionAllowance,
      millTol,
    ] // Dependencies for recalculation
  );

  // Derive materials from materialsData
  const materials = useMemo(
    () => {
      const metricMaterials = Object.keys(materialsData.Metric.materials);
      const imperialMaterials = Object.keys(materialsData.Imperial.materials);
      return [...new Set([...metricMaterials, ...imperialMaterials])] as MaterialName[];
    },
    [] // materialsData is static, so no dependencies needed
  );

  const {
    temperatureDisplay,
    allowableStressDisplay,
    corrosionAllowanceDisplay,
    pressureDisplay,
  } = useMemo(
    () =>
      convertDesignInputs({
        units,
        temperature,
        allowableStress: allowableStress,
        corrosionAllowance,
        pressure,
      }),
    [units, temperature, allowableStress, corrosionAllowance, pressure]
  );

  const designParams = useMemo(
    () => ({
      units,
      pressure: pressureDisplay,
      temperature: temperatureDisplay,
      corrosionAllowance: corrosionAllowanceDisplay,
      allowableStress: allowableStressDisplay,
      gamma,
      millTol,
      e,
      w,
      material: material,
    }),
    [
      units,
      pressureDisplay,
      temperatureDisplay,
      corrosionAllowanceDisplay,
      allowableStressDisplay,
      gamma,
      millTol,
      e,
      w,
      material,
    ]
  );

  const commonTabContentProps = {
    units,
    setUnits,
    material,
    setMaterial,
    temperature,
    setTemperature,
    allowableStress,
    setAllowableStress,
    corrosionAllowance,
    setCorrosionAllowance,
    e,
    setE,
    w,
    setW,
    gamma,
    setGamma,
    millTol,
    setMillTol,
    pressure,
    setPressure,
    pipes, // Pass `pipes` (the raw state)
    setPipes,
    pipesForDisplay, // Pass `pipesForDisplay` (the memoized, calculated version)
    materials,
    designParams,
    updatePipe,
    removePipe,
    handleUnitsChange,
    handleTemperatureChange,
    handleCAChange,
    handleDesignPressureChange,
  };

  return (
    <Box sx={{ width: "100%", ml: 0 }}>
      <Container maxWidth="lg" disableGutters>
        <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
          B31.3 Pipe Thickness Calculator
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { xs: "flex-start", md: "space-between" },
            alignItems: { xs: "flex-start", md: "center" },
            gap: { xs: 2, md: 0 },
            mt: 2,
            mb: 2,
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex(newValue)}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Single Pressure" />
            <Tab label="Multiple Pressures" />
          </Tabs>
          <UnitsToggle units={units} onChange={handleUnitsChange} />
        </Box>

        {/* Render content based on tabIndex */}
        {tabIndex === 0 && (
          <SinglePressureTabContent {...commonTabContentProps} />
        )}
        {tabIndex === 1 && (
          <MultiplePressuresTabContent {...commonTabContentProps} />
        )}
      </Container>
    </Box>
  );
}
