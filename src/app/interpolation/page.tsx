"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import InputValuesCard from "./../../components/interpolation/InputValuesCard";
import InterpolatedValueCard from "./../../components/interpolation/InterpolatedValuesCard";

export default function InterpolationPage() {
  const [x0, setX0] = useState(250);
  const [y0, setY0] = useState(132000);
  const [x1, setX1] = useState(300);
  const [y1, setY1] = useState(126000);
  const [x, setX] = useState(260);

  const interpolate = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x: number
  ) => {
    return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
  };

  const y = interpolate(x0, y0, x1, y1, x);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "white",
        p: 4,
        maxWidth: 1200,
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
        }}
      >
        <Box sx={{ flex: 1, minWidth: 450, height: 300 }}>
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
        </Box>

        <Box sx={{ flex: 1, minWidth: 450, height: 300 }}>
          <InterpolatedValueCard x0={x0} y0={y0} x1={x1} y1={y1} x={x} y={y} />
        </Box>
      </Box>
    </Box>
  );
}
