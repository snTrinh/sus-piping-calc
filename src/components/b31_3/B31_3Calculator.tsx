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

// Import the new tab content components

import UnitsToggle from "../common/UnitsToggle";
import SinglePressureTabContent from "./single/SinglePressureTabContent";
import MultiplePressuresTabContent from "./multiple/MultiplePressuresTabContent";
// Corrected import name from materialStress to materialStressLookup
import { materialStress } from "@/utils/materialStress"; // Corrected import path/name

type Pipe = {
  id: string;
  nps: string;
  od: string;
  schedule: PipeSchedule;
  tRequired: number;
  t: number;
};

export default function B31_3Calculator() {
  const [units, setUnits] = useState<Units>(Units.Imperial);
  const [material, setMaterial] = useState<MaterialName>("A106B"); // Initialized with a MaterialName
  const [temperature, setTemperature] = useState(100); // °F internally
  const [allowableStress, setAllowableStress] = useState<number>(0); // Initialize with 0
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
      tRequired: 0,
      t: 0,
    },
  ]);

  const [tabIndex, setTabIndex] = useState(0);


  useEffect(() => {

    const category = units === Units.Imperial ? "Imperial" : "Metric";


    const stress = materialStress(
      category,
      material, 
      temperature,
      units 
    );

    // Update the allowableStress state
    setAllowableStress(stress ?? 0);

    // Optionally, log a warning if stress is null
    if (stress === null) {
      console.warn(`Could not determine allowable stress for material: ${material}, temperature: ${temperature}, units: ${units}. Please check inputs and data range.`);
    }
  }, [units, material, temperature]); // Dependencies for this effect

  // Effect for calculating tRequired (thickness required)
  useEffect(() => {
    setPipes((prev) =>
      prev.map((pipe) => {
        const targetNps =
          units === Units.Metric ? npsToMmMap[pipe.nps] : pipe.nps;

        const outerDiameter =
          pipeData[units]?.columns?.find((col) => col.NPS === targetNps)?.OD ||
          0;

        const conversion = unitConversions.length[units];
        const outerDiameterInches = conversion.from(outerDiameter);
        const corrosionAllowanceInches =
          unitConversions.length[units].from(corrosionAllowance);

        const numerator = pressure * outerDiameterInches;
        const denominator =
          2 * ((allowableStress ?? 0) * e * w + pressure * gamma);
        const tRequired =
          denominator !== 0
            ? (numerator / denominator + corrosionAllowanceInches) *
              (1 / (1 - millTol))
            : 0;

        return { ...pipe, tRequired };
      })
    );
  }, [pressure, allowableStress, e, w, gamma, corrosionAllowance, units, millTol]); // Added millTol to dependencies

  // Handlers
  const handleUnitsChange = (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => {
    if (!newUnits || newUnits === units) return;

    // The internal state (temperature, pressure, corrosionAllowance)
    // will remain in its original numerical value.
    // The display conversion will happen in convertDesignInputs.

    setUnits(newUnits);
  };

  const handleTemperatureChange = (value: number) => {
    // Corrected: Convert the input 'value' from the current display unit
    // to the internal unit (Imperial) using the 'from' method.
    const convertedValue = unitConversions.temperature[units].from(value);
    setTemperature(convertedValue);
  };

  const handleCAChange = (value: number) => {
    // Corrected: Convert the input 'value' from the current display unit
    // to the internal unit (Imperial) using the 'from' method.
    const convertedValue = unitConversions.length[units].from(value);
    setCorrosionAllowance(convertedValue);
  };

  const handleDesignPressureChange = (value: number) => {
    const convertedValue = unitConversions.pressure[units].from(value);
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

  const pipesForDisplay = useMemo(
    () => pipes.map((pipe) => ({ ...pipe })),
    [pipes]
  );


  const materials = useMemo(
    () => {
      const metricMaterials = Object.keys(materialsData.Metric.materials);
      const imperialMaterials = Object.keys(materialsData.Imperial.materials);
      return [...new Set([...metricMaterials, ...imperialMaterials])] as MaterialName[];
    },
    [] 
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
        allowableStress: allowableStress ?? 0, // Ensure it's a number for conversion
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
    setUnits, // This prop is not used by Single/MultiplePressureTabContent, can be removed if not needed elsewhere
    material,
    setMaterial,
    temperature,
    setTemperature,
    allowableStress,
    setAllowableStress, // Pass the setter for allowableStress
    corrosionAllowance,
    setCorrosionAllowance, // This prop is not used by Single/MultiplePressureTabContent, can be removed if not needed elsewhere
    e,
    setE, // This prop is not used by Single/MultiplePressureTabContent, can be removed if not needed elsewhere
    w,
    setW, // This prop is not used by Single/MultiplePressureTabContent, can be removed if not needed elsewhere
    gamma,
    setGamma, // This prop is not used by Single/MultiplePressureTabContent, can be removed if not needed elsewhere
    millTol,
    setMillTol, // This prop is not used by Single/MultiplePressureTabContent, can be removed if not needed elsewhere
    pressure,
    setPressure, // This prop is not used by Single/MultiplePressureTabContent, can be removed if not needed elsewhere
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
