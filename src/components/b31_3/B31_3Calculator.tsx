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


import rawPipeData from "@/data/transformed_pipeData.json"; 
const typedPipeData: TransformedPipeData = rawPipeData as TransformedPipeData;

import SinglePressureTabContent from "./single/SinglePressureTabContent";
import MultiplePressuresTabContent from "./multiple/MultiplePressuresTabContent";
import UnitsToggle from "../common/UnitsToggle";
import { materialStress } from "@/utils/materialStress";
import { calculateTRequired } from "@/utils/pipeCalculations"; 

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
  const [material, setMaterial] = useState<MaterialName>("A106B");
  const [temperature, setTemperature] = useState(100);
  const [allowableStress, setAllowableStress] = useState<number | null>(null);
  const [corrosionAllowance, setCorrosionAllowance] = useState(0); 

  const [e, setE] = useState(1);
  const [w, setW] = useState(1); 
  const [gamma, setGamma] = useState(0.4);
  const [millTol, setMillTol] = useState(0.125);

  const [pressure, setPressure] = useState(1414); 

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

    if (stress !== allowableStress) {
      setAllowableStress(stress);
    }

    if (stress === null) {
      console.warn(
        `Could not determine allowable stress for material: ${material}, temperature: ${temperature}, units: ${units}. Please check inputs and data range.`
      );
    }
  }, [units, material, temperature, allowableStress, setAllowableStress]);


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
    setCorrosionAllowance(value);
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


  const pipesForDisplay = useMemo(
    () =>
      pipes.map((pipe) => {
        const currentNpsKey =
          units === Units.Metric ? npsToMmMap[pipe.nps]?.toString() : pipe.nps;
        const selectedPipeSizeData = typedPipeData[units]?.[currentNpsKey || ''];

        const outerDiameter = selectedPipeSizeData?.OD || 0;

        const outerDiameterInches = unitConversions.length[units].toImperial(
          outerDiameter
        );

        const calculatedTRequired = calculateTRequired({
          pressure,
          outerDiameterInches,
          allowableStress,
          e,
          w,
          gamma,
          corrosionAllowanceInches: corrosionAllowance, 
          millTol,
        });

        const rawScheduleThicknessImperial = selectedPipeSizeData?.schedules[
          pipe.schedule
        ] ?? 0;

        return {
          ...pipe,
          tRequired: calculatedTRequired,
          t: rawScheduleThicknessImperial, 
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
    ] 
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
            <Tab label="Multiple Pressure" />
          </Tabs>
          <UnitsToggle units={units} onChange={handleUnitsChange} />
        </Box>

 
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
