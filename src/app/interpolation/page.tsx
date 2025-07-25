"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container
} from "@mui/material";
import InputValuesCard from "./../../components/interpolation/InputValuesCard";
import InterpolatedValueCard from "./../../components/interpolation/InterpolatedValuesCard";

// Import the new TypeScript utility functions and data
import { linearInterpolation } from "./../../utils/interpolation";
import { materialsData, UnitCategory, MaterialName } from "./../../utils/materialsData";

export default function InterpolationPage() {
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
          Linear Interpolation Calculator
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

          <InterpolatedValueCard x0={x0} y0={y0} x1={x1} y1={y1} x={x} y={y} />
        </Box>
      </Container>
    </Box>
  );
}
