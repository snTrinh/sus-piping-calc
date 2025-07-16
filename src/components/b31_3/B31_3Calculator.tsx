"use client";
import React, { useEffect, useState, useMemo } from "react"; // Added useMemo for derived state
import { v4 as uuidv4 } from "uuid";
import { Box, Typography, Container, Tabs, Tab } from "@mui/material";
import { materialsData, MaterialName } from "./../../utils/materialsData"; // NEW: Import materialsData and MaterialName
import { Units } from "@/types/units";
import {
  convertDesignInputs,
  npsToMmMap,
  PipeSchedule,
  unitConversions,
} from "@/utils/unitConversions";
import pipeData from "@/data/pipeData.json"; // Assuming this is the correct path to pipe data
import pipeDimensions from "@/data/transformed_pipeData.json"; // NEW: Import pipeDimensions for 't' calculation

// Import the new tab content components

import UnitsToggle from "../common/UnitsToggle";
import SinglePressureTabContent from "./single/SinglePressureTabContent";
import MultiplePressuresTabContent from "./multiple/MultiplePressuresTabContent";
import { materialStress } from "@/utils/materialStress";



type Pipe = {
  id: string;
  nps: string;
  od: string;
  schedule: PipeSchedule;
  tRequired: number;
  t: number; // Actual schedule thickness
};

export default function B31_3Calculator() {
  const [units, setUnits] = useState<Units>(Units.Imperial);
  const [material, setMaterial] = useState<MaterialName>("A106B"); // Initialized with a MaterialName
  const [temperature, setTemperature] = useState(100); // °F internally
  const [allowableStress, setAllowableStress] = useState<number | null>(null); // Changed to number | null
  const [corrosionAllowance, setCorrosionAllowance] = useState(0); // inches

  const [e, setE] = useState(1);
  const [w, setW] = useState(1);
  const [gamma, setGamma] = useState(0.4);
  const [millTol, setMillTol] = useState(0.125);
  const [pressure, setPressure] = useState(1414); // psi

  const [pipes, setPipes] = useState<Pipe[]>([
    {
      id: uuidv4(),
      nps: "4",
      od: "4.5",
      schedule: "40",
      tRequired: 0, // This will be recalculated by the useEffect below
      t: 0, // This will be recalculated by the useEffect below
    },
  ]);

  const [tabIndex, setTabIndex] = useState(0);

  // Effect to automatically calculate allowableStress on relevant input changes
  useEffect(() => {
    // Determine the category based on units
    const category = units === Units.Imperial ? "Imperial" : "Metric";

    // Call the materialStressLookup function with the correct number of arguments
    const stress = materialStress( // Corrected function name
      category,
      material, // material state is now MaterialName
      temperature,
      units // Pass the current units state as the fourth argument
    );

    // Update the allowableStress state
    setAllowableStress(stress); // Assign stress directly, it can be null

    // Optionally, log a warning if stress is null
    if (stress === null) {
      console.warn(`Could not determine allowable stress for material: ${material}, temperature: ${temperature}, units: ${units}. Please check inputs and data range.`);
    }
  }, [units, material, temperature]); // Dependencies for this effect

  // Effect for calculating tRequired (thickness required) and t (actual schedule thickness) for all pipes
  useEffect(() => {
    console.log("--- Calculating tRequired and t for pipes ---");
    setPipes((prev) =>
      prev.map((pipe) => {
        const targetNps =
          units === Units.Metric ? npsToMmMap[pipe.nps] : pipe.nps;

        // Get outer diameter from pipeData based on current units
        const outerDiameter =
          pipeData[units]?.columns?.find((col) => col.NPS === targetNps)?.OD ||
          0;
        console.log(`Pipe ${pipe.nps} OD (display units): ${outerDiameter}`);

        const lengthConversion = unitConversions.length[units];

        // Convert OD to Imperial inches for calculation (as formula expects Imperial)
        const outerDiameterInches = lengthConversion.toImperial(outerDiameter);
        // Convert corrosionAllowance to Imperial inches for calculation
        const corrosionAllowanceInches = lengthConversion.toImperial(corrosionAllowance);

        // Pressure is already stored internally in PSI (Imperial)
        // Allowable stress is already stored internally in PSI (Imperial)

        console.log(`Pressure (internal/PSI): ${pressure}`);
        console.log(`Allowable Stress (internal/PSI): ${allowableStress}`);
        console.log(`E: ${e}, W: ${w}, Gamma: ${gamma}`);
        console.log(`Corrosion Allowance (internal/inches): ${corrosionAllowanceInches}`);
        console.log(`Mill Tolerance: ${millTol}`);

        const numerator = pressure * outerDiameterInches;
        const denominator =
          2 * ((allowableStress ?? 0) * e * w + pressure * gamma);

        console.log(`Numerator: ${numerator}`);
        console.log(`Denominator: ${denominator}`);

        const calculatedTRequired =
          denominator !== 0
            ? (numerator / denominator + corrosionAllowanceInches) *
              (1 / (1 - millTol))
            : 0;

        console.log(`Calculated tRequired for pipe ${pipe.nps}: ${calculatedTRequired}`);

        // Calculate actual schedule thickness (pipe.t)
        // This value is stored in Imperial inches in transformed_pipeData.json
        // @ts-expect-error transformed_pipeData.json structure needs explicit type assertion if not fully typed
        const rawScheduleThicknessImperial = pipeDimensions["Imperial"][pipe.nps]?.schedules[pipe.schedule] ?? 0;
        console.log(`Raw schedule thickness for pipe ${pipe.nps} SCH ${pipe.schedule} (Imperial inches): ${rawScheduleThicknessImperial}`);

        return {
          ...pipe,
          tRequired: calculatedTRequired,
          t: rawScheduleThicknessImperial, // Store actual thickness in Imperial inches
        };
      })
    );
  }, [pressure, allowableStress, e, w, gamma, corrosionAllowance, units, millTol, pipes]); // Dependency on 'pipes' array itself

  // Handlers
  const handleUnitsChange = (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => {
    if (!newUnits || newUnits === units) return;

    // When units change, the internal state values (temperature, pressure, corrosionAllowance)
    // remain numerically the same, but their interpretation (and how they are displayed) changes.
    // The `useEffect` for tRequired and allowableStress will re-run due to `units` dependency.

    setUnits(newUnits);
  };

  const handleTemperatureChange = (value: number) => {
    // Convert the input 'value' from the current display unit
    // to the internal unit (Imperial) using the 'toImperial' method for consistency.
    const convertedValue = unitConversions.temperature[units].toImperial(value);
    setTemperature(convertedValue);
  };

  const handleCAChange = (value: number) => {
    // Convert the input 'value' from the current display unit
    // to the internal unit (Imperial) using the 'toImperial' method.
    const convertedValue = unitConversions.length[units].toImperial(value);
    setCorrosionAllowance(convertedValue);
  };

  const handleDesignPressureChange = (value: number) => {
    // Convert the input 'value' from the current display unit
    // to the internal unit (Imperial) using the 'toImperial' method.
    const convertedValue = unitConversions.pressure[units].toImperial(value);
    setPressure(convertedValue);
  };

  const updatePipe = (id: string, key: keyof Pipe, value: Pipe[keyof Pipe]) => {
    setPipes((prev) =>
      prev.map((pipe) => (pipe.id === id ? { ...pipe, [key]: value } : pipe))
    );
  };

  const removePipe = (id: string) => {
    setPipes((prev) => prev.filter((p) => p.id !== id));
  };

  // Derived states and props to pass down using useMemo for optimization
  const pipesForDisplay = useMemo(
    () => pipes.map((pipe) => ({ ...pipe })), // Create a new array to ensure memoization works
    [pipes]
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
        allowableStress: allowableStress, // Pass allowableStress directly (can be null)
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
      material: material, // Include material in designParams
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
      material, // Added material to dependencies
    ]
  );

  // Bundle all props needed by tab content components
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
    pipes,
    setPipes,
    pipesForDisplay,
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
