"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  Tabs,
  Tab,
} from "@mui/material";

import { materialStressLookup } from "./../../utils/materialStressLookup";
import stressData from "@/data/stressValues.json";
import PipeCard from "./PipeCard";
import UnitsToggle from "./../common/UnitsToggle";
import { Units } from "@/types/units";
import {
  convertDesignInputs,
  npsToMmMap,
  PipeSchedule,
  unitConversions,
} from "@/utils/unitConversions";
import FormulaDisplay from "./FormulaDisplay";
import DesignInputs from "./DesignInputs";
import pipeData from "@/utils/pipeData.json";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PdfExport from "./pdfExport/PdfExport";

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
  const [material, setMaterial] = useState("A333-6");
  const [temperature, setTemperature] = useState(100); // °F internally
  const [allowableStress, setAllowableStress] = useState(
    materialStressLookup(units, "A312TP316L", temperature)
  ); // psi internally
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
    const match = stressData.find(
      (item) => item.material === material && item.temp === temperature
    );
    if (match) setAllowableStress(match.stress);
  }, [material, temperature]);

  useEffect(() => {
    setPipes((prev) =>
      prev.map((pipe) => {
        const targetNps =
          units === Units.Metric ? npsToMmMap[pipe.nps] : pipe.nps;

        let outerDiameter =
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
  }, [pressure, allowableStress, e, w, gamma, corrosionAllowance, units]);

  const handleUnitsChange = (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => {
    if (!newUnits || newUnits === units) return;
    setUnits(newUnits);
  };

  const handleTemperatureChange = (value: number) => {
    setTemperature(value);
  };

  const handleCAChange = (value: number) => {
    setCorrosionAllowance(value);
  };

  const handleDesignPressureChange = (value: number) => {
    setPressure(value);
  };

  const updatePipe = (id: string, key: keyof Pipe, value: any) => {
    setPipes((prev) =>
      prev.map((pipe) => (pipe.id === id ? { ...pipe, [key]: value } : pipe))
    );
  };

  const pipesForDisplay = pipes.map((pipe) => ({ ...pipe }));

  const materials = [...new Set(stressData.map((d) => d.material))];

  const {
    temperatureDisplay,
    allowableStressDisplay,
    corrosionAllowanceDisplay,
    pressureDisplay,
  } = convertDesignInputs({
    units,
    temperature,
    allowableStress: allowableStress ?? 0,
    corrosionAllowance,
    pressure,
  });

  const designParams = {
    units,
    pressure: pressureDisplay,
    temperature: temperatureDisplay,
    corrosionAllowance: corrosionAllowanceDisplay,
    allowableStress: allowableStressDisplay,
    gamma,
    millTol,
    e,
    w,
  };

  return (
    <Box sx={{ width: "100%", ml: 0 }}>
      <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
        B31.3 Pipe Thickness Calculator
      </Typography>

      <UnitsToggle units={units} onChange={handleUnitsChange} />

      <Tabs
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mt: 2 }}
      >
        <Tab label="Single Pressure" />
        <Tab label="Multiple Pressures" />
      </Tabs>

      {tabIndex === 0 && (
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
            {/* Left Column: Inputs */}
            <Card
              sx={{
                flex: 1,
                minWidth: 450,
                display: "flex",
                flexDirection: "column",
                p: 2,
                gap: 2,
                height: "100%",
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

              <Button
                startIcon={<AddCircleOutlineIcon />}
                variant="outlined"
                onClick={() =>
                  setPipes((prev) => [
                    ...prev,
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
            </Card>

            <Card
              sx={{
                flex: 1,
                minWidth: 450,
                display: "flex",
                flexDirection: "column",
                p: 2,
                gap: 2,
                height: "100%",
              }}
            >
              <FormulaDisplay designParams={designParams} />
            </Card>
          </Box>

          <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
            {pipesForDisplay.map((pipe) => (
              <PipeCard
                key={pipe.id}
                pipe={pipe}
                updatePipe={updatePipe}
                removePipe={(id) =>
                  setPipes((prev) => prev.filter((p) => p.id !== id))
                }
                units={units}
              />
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
      )}

      {tabIndex === 1 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Material Info
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Selected Material: <strong>{material}</strong>
          </Typography>
          <Typography variant="body1">
            Temperature: <strong>{temperatureDisplay}</strong>
          </Typography>
          <Typography variant="body1">
            Allowable Stress: <strong>{allowableStressDisplay}</strong>
          </Typography>
        </Box>
      )}

      {tabIndex === 2 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Mill Tolerance: <strong>{millTol}</strong>
          </Typography>
          <Typography variant="body1">
            Weld Joint Efficiency (E): <strong>{e}</strong>
          </Typography>
          <Typography variant="body1">
            Strength Reduction Factor (W): <strong>{w}</strong>
          </Typography>
          <Typography variant="body1">
            Gamma: <strong>{gamma}</strong>
          </Typography>
          {/* Optionally add inputs or controls here to adjust these */}
        </Box>
      )}
    </Box>
  );
}
