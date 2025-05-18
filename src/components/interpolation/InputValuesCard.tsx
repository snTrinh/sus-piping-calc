"use client";

import { Box, Card, CardContent, Typography, TextField } from "@mui/material";

type InputValuesCardProps = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  x: number;
  setX0: (value: number) => void;
  setY0: (value: number) => void;
  setX1: (value: number) => void;
  setY1: (value: number) => void;
  setX: (value: number) => void;
};

export default function InputValuesCard({
  x0,
  y0,
  x1,
  y1,
  x,
  setX0,
  setY0,
  setX1,
  setY1,
  setX,
}: InputValuesCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Input Values
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* x₀ and y₀ */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Lower Limit x₀"
              type="number"
              fullWidth
              value={x0}
              onChange={(e) => setX0(Number(e.target.value))}
            />
            <TextField
              label="Lower Limit y₀"
              type="number"
              fullWidth
              value={y0}
              onChange={(e) => setY0(Number(e.target.value))}
            />
          </Box>
          {/* x₁ and y₁ */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Upper Limit x₁"
              type="number"
              fullWidth
              value={x1}
              onChange={(e) => setX1(Number(e.target.value))}
            />
            <TextField
              label="Upper Limit y₁"
              type="number"
              fullWidth
              value={y1}
              onChange={(e) => setY1(Number(e.target.value))}
            />
          </Box>
          {/* x and y */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="x"
              type="number"
              fullWidth
              value={x}
              onChange={(e) => setX(Number(e.target.value))}
            />
            {/* y is calculated in parent, so no need here */}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
