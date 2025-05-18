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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import stressData from "@/data/stressValues.json";
import thicknessByNpsSchedule from "@/data/thicknessByNpsSchedule.json";
import PipeCard from "./PipeCard";

type Pipe = {
  id: string;
  nps: string;
  schedule: string;
  tRequired: number;
};

export default function B31_3Calculator() {
  const [units, setUnits] = useState<"imperial" | "metric">("imperial");

  const [material, setMaterial] = useState("A333 Grade 6");
  const [temperature, setTemperature] = useState(100); // °F internally
  const [stress, setStress] = useState(20000); // psi internally
  const [ca, setCA] = useState(0); // inches

  // New variables for the formula
  const [e, setE] = useState(1); // Weld joint efficiency
  const [w, setW] = useState(1); // Weld strength reduction factor
  const [gamma, setGamma] = useState(0.4); // Gamma coefficient

  const [designPressure, setDesignPressure] = useState(1414); // psi

  const [pipes, setPipes] = useState<Pipe[]>([
    {
      id: uuidv4(),
      nps: "4",
      schedule: "40",
      tRequired: 0,
    },
  ]);

  // Unit conversion helpers
  const psiToMpa = (psi: number) => psi * 0.00689476;
  const mpaToPsi = (mpa: number) => mpa / 0.00689476;
  const inchToMm = (inch: number) => inch * 25.4;
  const mmToInch = (mm: number) => mm / 25.4;
  const fToC = (f: number) => ((f - 32) * 5) / 9;
  const cToF = (c: number) => (c * 9) / 5 + 32;

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
        const denominator = 2 * (stress * e * w + designPressure * gamma);
        const tRequired = denominator !== 0 ? numerator / denominator + ca : 0;
        return { ...pipe, tRequired };
      })
    );
  }, [designPressure, stress, e, w, gamma, ca]);

  // Unit toggle and conversions
  const handleUnitsChange = (
    event: React.MouseEvent<HTMLElement>,
    newUnits: "imperial" | "metric" | null
  ) => {
    if (!newUnits || newUnits === units) return;

    if (newUnits === "imperial") {
      setTemperature(cToF(temperature));
      setStress(mpaToPsi(stress));
      setCA(mmToInch(ca));
      setDesignPressure(designPressure / 6.89476); // kPa → psi
      setPipes((prev) =>
        prev.map((pipe) => ({
          ...pipe,
          tRequired: mmToInch(pipe.tRequired),
        }))
      );
    } else {
      setTemperature(fToC(temperature));
      setStress(psiToMpa(stress));
      setCA(inchToMm(ca));
      setDesignPressure(designPressure * 6.89476); // psi → kPa
      setPipes((prev) =>
        prev.map((pipe) => ({
          ...pipe,
          tRequired: inchToMm(pipe.tRequired),
        }))
      );
    }

    setUnits(newUnits);
  };

  const handleTemperatureChange = (value: number) => {
    if (units === "imperial") {
      setTemperature(value);
    } else {
      setTemperature(cToF(value));
    }
  };

  const handleCAChange = (value: number) => {
    if (units === "imperial") {
      setCA(value);
    } else {
      setCA(mmToInch(value));
    }
  };

  const handleDesignPressureChange = (value: number) => {
    if (units === "imperial") {
      setDesignPressure(value);
    } else {
      setDesignPressure(value / 6.89476); // kPa → psi
    }
  };

  const updatePipe = (id: string, key: keyof Pipe, value: any) => {
    setPipes((prev) =>
      prev.map((pipe) => (pipe.id === id ? { ...pipe, [key]: value } : pipe))
    );
  };

  const pipesForDisplay = pipes.map((pipe) => ({
    ...pipe,
    tRequired: units === "imperial" ? pipe.tRequired : inchToMm(pipe.tRequired),
  }));

  const materials = [...new Set(stressData.map((d) => d.material))];

  return (
    <Container maxWidth="md" sx={{ pb: 8 }}>
      <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
        B31.3 Pipe Thickness Calculator
      </Typography>

      <ToggleButtonGroup
        value={units}
        exclusive
        onChange={handleUnitsChange}
        sx={{ mb: 3 }}
      >
        <ToggleButton value="imperial">Imperial</ToggleButton>
        <ToggleButton value="metric">Metric</ToggleButton>
      </ToggleButtonGroup>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
          justifyContent: "flex-start",
        }}
      >
        <TextField
          select
          label="Material"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          sx={{ minWidth: 200 }}
          size="small"
        >
          {materials.map((mat) => (
            <MenuItem key={mat} value={mat}>
              {mat}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={`Design Pressure (${units === "imperial" ? "psi" : "kPa"})`}
          type="number"
          value={
            units === "imperial"
              ? Math.round(designPressure * 100) / 100
              : Math.round(designPressure * 6.89476 * 100) / 100
          }
          onChange={(e) => handleDesignPressureChange(Number(e.target.value))}
          size="small"
          sx={{ minWidth: 180 }}
        />

        <TextField
          label={`Temperature (${units === "imperial" ? "°F" : "°C"})`}
          type="number"
          value={
            units === "imperial"
              ? temperature
              : Math.round(fToC(temperature) * 100) / 100
          }
          onChange={(e) => handleTemperatureChange(Number(e.target.value))}
          size="small"
          inputProps={{ min: 0 }}
          sx={{ minWidth: 180 }}
        />

        <TextField
          label={`Corrosion Allowance (${units === "imperial" ? "in" : "mm"})`}
          type="number"
          value={
            units === "imperial" ? ca : Math.round(inchToMm(ca) * 100) / 100
          }
          onChange={(e) => handleCAChange(Number(e.target.value))}
          size="small"
          inputProps={{ step: 0.01, min: 0 }}
          sx={{ minWidth: 180 }}
        />
        <TextField
          label={`Allowable Stress (${units === "imperial" ? "psi" : "MPa"})`}
          value={
            units === "imperial"
              ? stress.toFixed(2)
              : (stress * 0.00689476).toFixed(2)
          }
          size="small"
          disabled
          sx={{ minWidth: 200 }}
        />

        {/* New fields for E, W, and gamma */}
        <TextField
          label="Weld Joint Efficiency (E)"
          type="number"
          value={e}
          disabled
          size="small"
          inputProps={{ step: 0.01, min: 0, max: 1 }}
          sx={{ minWidth: 180 }}
        />

        <TextField
          label="Weld Strength Reduction Factor (W)"
          type="number"
          value={w}
          disabled
          size="small"
          inputProps={{ step: 0.01, min: 0, max: 1 }}
          sx={{ minWidth: 180 }}
        />

        <TextField
          label="Temperature Coefficient (γ)"
          type="number"
          value={gamma}
          disabled
          size="small"
          inputProps={{ step: 0.01, min: 0 }}
          sx={{ minWidth: 180 }}
        />
      </Box>

      <Box sx={{ backgroundColor: "#f9f9f9", p: 2, borderRadius: 1, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Required Thickness (ASME B31.3):</strong>{" "}
          <Typography variant="body2" component="span">
            t =
          </Typography>
          <Box
            sx={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "0.875rem",
              lineHeight: 1,
            }}
          >
            <Box sx={{ borderBottom: "1px solid #000", px: 0.5 }}>(P × D)</Box>
            <Box sx={{ px: 0.5 }}>[2(SEW + Pγ)]</Box>
          </Box>
          <Typography variant="body2" component="span">
            + CA
          </Typography>
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={() => {
          setPipes((prev) => [
            ...prev,
            {
              id: uuidv4(),
              nps: "2",
              schedule: "40",
              tRequired: 0,
            },
          ]);
        }}
        sx={{ mb: 4 }}
      >
        ➕ Add Pipe
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
    </Container>
  );
}
