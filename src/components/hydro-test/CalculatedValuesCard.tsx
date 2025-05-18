"use client";

import { Box, Card, CardContent, TextField, Typography } from "@mui/material";

type CalculatedValueCardProps = {
  Pt: number;
  P: number;
  St: number;
  S: number;
};

export default function CalculatedValueCard({
  Pt,
  P,
  St,
  S,
}: CalculatedValueCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Calculated Value as per B31.3 345.4.2
        </Typography>
        {/* Formula Display */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" component="span">
              Pₜ = 1.5P
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
              <Box sx={{ borderBottom: "1px solid #000", px: 0.5 }}>Sₜ*</Box>
              <Box sx={{ px: 0.5 }}>S</Box>
            </Box>
            <Typography variant="body2" component="span">
              * Typically test temp is &lt; 38 &deg;C
              <br />
            </Typography>
          </Box>

          {/* Formula with actual values */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" component="span">
              Pₜ = 1.5({P})
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
              <Box sx={{ borderBottom: "1px solid #000", px: 0.5 }}>{St}</Box>
              <Box sx={{ px: 0.5 }}>{S}</Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Test Gauge Pressure P"
            type="number"
            fullWidth
            value={Pt}
            disabled
            sx={{
              // Match styles from InputValuesCard
              mt: 4, // Adjust margin-top if needed
            }}
          />
          {/* y is calculated in parent, so no need here */}
        </Box>
      </CardContent>
    </Card>
  );
}
