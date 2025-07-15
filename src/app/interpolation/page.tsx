"use client";

import { useState } from "react";
import { Box, Typography, Container } from "@mui/material";
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
      // This outer Box can still handle minHeight or background for the whole page
      sx={{
        minHeight: "100vh",
      }}
    >
      <Container
        maxWidth="lg" // Set your desired max width (e.g., "md", "lg", "xl")
        disableGutters // Remove default horizontal padding from the Container
        sx={{
          // Responsive padding for the Container:
          // pt: padding-top
          // px: padding-left and padding-right (horizontal padding)
          // { xs: 2, md: 4 } means:
          //   - For extra-small screens (xs) and up, apply spacing unit 2 (2 * 8px = 16px)
          //   - For medium screens (md) and up, override to spacing unit 4 (4 * 8px = 32px)
          pt: { xs: 4, md: 4 }, // 16px top padding on mobile, 32px on desktop
          px: { xs: 4,  md: 4, lg: 0 }, // 16px horizontal padding on mobile, 32px on desktop
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
            alignItems: "stretch", // Ensures cards stretch to equal height
            mt: 2, // Add some top margin below the title
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
