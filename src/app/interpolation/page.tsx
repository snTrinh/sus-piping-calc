"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  CardContent,
  Card,
} from "@mui/material";
import InputValuesCard from "./../../components/interpolation/InputValuesCard";
import InterpolatedValueCard from "./../../components/interpolation/InterpolatedValuesCard";

// Import the new TypeScript utility functions and data
import { linearInterpolation } from "./../../utils/interpolation";
import { materialStress } from "./../../utils/materialStress";
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
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>("Metric");
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialName>("A106B");
  const [inputTemperature, setInputTemperature] = useState(200); // Default temperature for material lookup
  const [materialStressResult, setMaterialStressResult] = useState<number | null>(null);
  const [materialLookupError, setMaterialLookupError] = useState<string | null>(null);

  // Dynamically get available materials for the selected category
  const availableMaterials = Object.keys(materialsData[selectedCategory].materials) as MaterialName[];

  // Effect to update material dropdown if selected material is not available in new category
  useEffect(() => {
    if (!availableMaterials.includes(selectedMaterial)) {
      setSelectedMaterial(availableMaterials[0] || "A106B"); // Default to first available or A106B
    }
  }, [selectedCategory, availableMaterials, selectedMaterial]);


  const handleMaterialStressLookup = () => {
    setMaterialLookupError(null); // Clear previous errors
    const result = materialStressLookup(
      selectedCategory,
      selectedMaterial,
      inputTemperature
    );

    if (result === null) {
      setMaterialLookupError("Could not find stress value for the given inputs. Check console for warnings.");
    }
    setMaterialStressResult(result);
  };

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
          Linear Interpolation
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

        {/* --- Material Stress Lookup Section --- */}
        <Typography variant="h4" fontWeight="bold" align="left" gutterBottom sx={{ mt: 6 }}>
          Material Stress Lookup
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
          <Card
            sx={{
              flex: 1,
              minWidth: 450,
              display: "flex",
              flexDirection: "column",
              height: 500,
              border: "1px solid #ddd",
            }}
            elevation={0}
          >
            <CardContent sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom>
                Material Data Inputs
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Unit Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Unit Category"
                  onChange={(e) => setSelectedCategory(e.target.value as UnitCategory)}
                >
                  {Object.keys(materialsData).map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Material</InputLabel>
                <Select
                  value={selectedMaterial}
                  label="Material"
                  onChange={(e) => setSelectedMaterial(e.target.value as MaterialName)}
                >
                  {availableMaterials.map((mat) => (
                    <MenuItem key={mat} value={mat}>
                      {mat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Temperature"
                type="number"
                fullWidth
                value={inputTemperature}
                onChange={(e) => setInputTemperature(Number(e.target.value))}
                size="small"
                InputProps={{
                  inputProps: {
                    step: "1",
                  },
                  sx: {
                    "& input[type=number]::-webkit-inner-spin-button": {
                      "-webkit-appearance": "none",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleMaterialStressLookup}
                sx={{ mt: 1, px: 5, py: 1 }}
              >
                Lookup Stress
              </Button>
              {materialStressResult !== null ? (
                <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                  Stress Value: <strong>{materialStressResult.toFixed(2)}</strong>
                </Typography>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  Enter inputs and click "Lookup Stress"
                </Typography>
              )}
              {materialLookupError && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Error: {materialLookupError}
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              minWidth: { xs: "auto", md: 450 },
              display: "flex",
              flexDirection: "column",
              height: 250,
              border: "1px solid #ddd",
            }}
            elevation={0}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Result
              </Typography>
              {materialStressResult !== null ? (
                <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                  Stress Value: <strong>{materialStressResult.toFixed(2)}</strong>
                </Typography>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  Enter inputs and click "Lookup Stress"
                </Typography>
              )}
              {materialLookupError && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Error: {materialLookupError}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
