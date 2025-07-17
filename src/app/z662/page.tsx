"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Container,
  Card
} from "@mui/material";
import InputValuesCard from "./../../components/interpolation/InputValuesCard";
import InterpolatedValueCard from "./../../components/interpolation/InterpolatedValuesCard";

// Import the new TypeScript utility functions and data
import { linearInterpolation } from "./../../utils/interpolation";
import { materialsData, UnitCategory, MaterialName } from "./../../utils/materialsData";
import FormulaDisplay from "@/components/b31_3/FormulaDisplay";
import { Units } from "@/types/units";

export default function InterpolationPage() {

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
    const designParams = useMemo(
        () => ({
          units,
          pressure,
          temperature,
          corrosionAllowance,
          allowableStress,
          gamma,
          millTol,
          e,
          w,
          material: material,
        }),
        [
          units,
          pressure,
          temperature,
          corrosionAllowance,
          allowableStress,
          gamma,
          millTol,
          e,
          w,
          material,
        ]
      );
  // --- State for Generic Linear Interpolation ---
  const [x0, setX0] = useState(250);
  const [y0, setY0] = useState(132000);
  const [x1, setX1] = useState(300);
  const [y1, setY1] = useState(126000);
  const [x, setX] = useState(260);

  // Calculate y using the imported linearInterpolation function
  const y = linearInterpolation(x, x0, y0, x1, y1);

  // --- State for Material Stress Lookup ---
  const [selectedCategory] = useState<UnitCategory>("Metric");
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialName>("A106B");


  // Dynamically get available materials for the selected category
  const availableMaterials = Object.keys(materialsData[selectedCategory].materials) as MaterialName[];

  // Effect to update material dropdown if selected material is not available in new category
  useEffect(() => {

    if (availableMaterials.length === 0) {
      // If no materials are available for the selected category, ensure selectedMaterial is a sensible default
      if (selectedMaterial !== "A106B") { // Only update if it's not already the default
        console.warn(`No materials available for category '${selectedCategory}'. Setting material to 'A106B'.`);
        setSelectedMaterial("A106B");
      }
    } else if (!availableMaterials.includes(selectedMaterial)) {
      // If selected material is not valid for the new category, set to the first available
      console.log(`Selected material '${selectedMaterial}' not available in '${selectedCategory}'. Setting to '${availableMaterials[0]}'.`);
      setSelectedMaterial(availableMaterials[0]);
    }
  }, [selectedCategory, availableMaterials, selectedMaterial]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          pt: { xs: 4, md: 4 },
          px: { xs: 4, md: 4, lg: 0 },
        }}
      >
        <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
          CSA Z662
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "stretch",
            mt: 2,
          }}
        >
          <InputValuesCard
            x0={x0}
            y0={y0}
            x1={x1}
            y1={y1}
            x={x}
            setX0={setX0}
            setY0={setY0}
            setX1={setX1}
            setY1={setY1}
            setX={setX}
          />

        
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
      </Container>
    </Box>
  );
}
