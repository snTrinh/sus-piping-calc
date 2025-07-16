"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Container,
} from "@mui/material";
import InputValuesCard from "./../../components/interpolation/InputValuesCard";
import InterpolatedValueCard from "./../../components/interpolation/InterpolatedValuesCard";
import { linearInterpolation } from "./../../utils/interpolation";

export default function InterpolationPage() {

  const [x0, setX0] = useState(250);
  const [y0, setY0] = useState(132000);
  const [x1, setX1] = useState(300);
  const [y1, setY1] = useState(126000);
  const [x, setX] = useState(260);

  // Calculate y using the imported linearInterpolation function
  const y = linearInterpolation(x, x0, y0, x1, y1);

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
      </Container>
    </Box>
  );
}
