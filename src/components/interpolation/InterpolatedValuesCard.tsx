"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";

type InterpolatedValueCardProps = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  x: number;
  y: number;
};

export default function InterpolatedValueCard({
  x0,
  y0,
  x1,
  y1,
  x,
  y,
}: InterpolatedValueCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Interpolated Value
        </Typography>
        <Typography variant="h4" color="primary" gutterBottom>
          y = {y.toFixed(2)}
        </Typography>
        <Typography variant="body1" gutterBottom>
          (x₀, y₀) = ({x0}, {y0})<br />
          (x₁, y₁) = ({x1}, {y1})<br />
          (x, y) = ({x}, {y.toFixed(2)})
        </Typography>

        {/* Formula Display */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" component="span">
              y = y₀ + (x − x₀)
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
                y₁ − y₀
              </Box>
              <Box sx={{ px: 0.5 }}>x₁ − x₀</Box>
            </Box>
          </Box>
          {/* Formula with actual values */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" component="span">
              y = {y0} + ({x} − {x0})
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
                {y1} − {y0}
              </Box>
              <Box sx={{ px: 0.5 }}>
                {x1} − {x0}
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
