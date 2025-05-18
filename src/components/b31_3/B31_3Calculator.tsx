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
import { materialStressLookup } from "./../../utils/materialStressLookup";
import stressData from "@/data/stressValues.json";
import thicknessByNpsSchedule from "@/data/thicknessByNpsSchedule.json";
import PipeCard from "./PipeCard";
import PdfExport from "../PdfExport";
import UnitsToggle from "./../common/UnitsToggle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LabeledInput from "../common/LabeledInput";
import { Units } from "@/types/units";
import { convertDesignInputs, unitConversions } from "@/utils/unitConversions";

type Pipe = {
  id: string;
  nps: string;
  schedule: string;
  tRequired: number;
};

export default function B31_3Calculator() {
  const [units, setUnits] = useState<Units>(Units.Imperial);

  const [material, setMaterial] = useState("A333 Grade 6");
  const [temperature, setTemperature] = useState(100); // °F internally
  const [stress, setStress] = useState(
    materialStressLookup(units, "A312TP316L", temperature)
  ); // psi internally
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

  // Unit toggle and conversions
  const handleUnitsChange = (
    event: React.MouseEvent<HTMLElement>,
    newUnits: Units
  ) => {
    if (!newUnits || newUnits === units) return;

    setTemperature(unitConversions.temperature[newUnits].from(temperature));
    setStress(unitConversions.pressure[newUnits].from(stress ?? 0));
    setCA(unitConversions.thickness[newUnits].from(ca));
    setDesignPressure(unitConversions.pressure[newUnits].from(designPressure));

    setPipes((prev) =>
      prev.map((pipe) => ({
        ...pipe,
        tRequired: unitConversions.thickness[newUnits].from(pipe.tRequired),
      }))
    );

    setUnits(newUnits);
  };

  const handleTemperatureChange = (value: number) => {
    setTemperature(unitConversions.temperature[units].from(value));
  };

  const handleCAChange = (value: number) => {
    setCA(unitConversions.thickness[units].from(value));
  };

  const handleDesignPressureChange = (value: number) => {
    setDesignPressure(unitConversions.pressure[units].from(value));
  };

  const updatePipe = (id: string, key: keyof Pipe, value: any) => {
    setPipes((prev) =>
      prev.map((pipe) => (pipe.id === id ? { ...pipe, [key]: value } : pipe))
    );
  };

  const pipesForDisplay = pipes.map((pipe) => ({
    ...pipe,
    tRequired: unitConversions.thickness[units].to(pipe.tRequired),
  }));

  const materials = [...new Set(stressData.map((d) => d.material))];
  const {
    temperatureDisplay,
    stressDisplay,
    caDisplay,
    pressureDisplay,
    pressureUnit,
    caUnit,
    stressUnit,
    tempUnit,
  } = convertDesignInputs({
    units,
    temperature,
    stress: stress ?? 0,
    ca,
    designPressure,
  });
  return (
    <Container maxWidth="md" sx={{ pb: 8 }}>
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
        <LabeledInput
          label="Design Pressure"
          symbol="P"
          unit={pressureUnit}
          value={pressureDisplay}
          onChange={handleDesignPressureChange}
        />

        <LabeledInput
          label="Temperature"
          symbol="T"
          unit={tempUnit}
          value={temperatureDisplay}
          onChange={handleTemperatureChange}
        />

        <LabeledInput
          label="Corrosion Allowance"
          symbol="CA"
          unit={caUnit}
          value={caDisplay}
          onChange={handleCAChange}
        />

        <LabeledInput
          label="Allowable Stress"
          symbol="S"
          unit={stressUnit}
          value={stressDisplay}
          onChange={() => {}}
          disabled
        />

        <LabeledInput
          label="Weld Joint Efficiency"
          symbol="E"
          unit=""
          value={e}
          onChange={() => {}}
          disabled
        />

        <LabeledInput
          label="Weld Strength Reduction Factor"
          symbol="W"
          unit=""
          value={w}
          onChange={() => {}}
          disabled
        />

        <LabeledInput
          label="Temperature Coefficient"
          symbol="γ"
          unit=""
          value={gamma}
          onChange={() => {}}
          disabled
        />
      </Box>
      <Box sx={{ backgroundColor: "#f9f9f9", p: 2, borderRadius: 1, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Required Thickness (ASME B31.3):</strong>{" "}
          <Typography variant="body2" component="span">
            tᵣ =
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
      <Box sx={{ backgroundColor: "#f9f9f9", p: 2, borderRadius: 1, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Required Thickness (ASME B31.3):</strong>{" "}
          <Typography variant="body2" component="span">
            tᵣ =
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
            <Box sx={{ borderBottom: "1px solid #000", px: 0.5 }}>
              ({designPressure} × D)
            </Box>
            <Box sx={{ px: 0.5 }}>
              [2(({stress})({e})({w}) + ({designPressure})({gamma}))]
            </Box>
          </Box>
          <Typography variant="body2" component="span">
            + {ca}
          </Typography>
        </Typography>
      </Box>
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

      <PdfExport units={units} />
    </Container>
  );
}
