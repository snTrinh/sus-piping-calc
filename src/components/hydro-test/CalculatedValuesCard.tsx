"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import LabeledInput from "../common/LabeledInput";
import { Units } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";

type CalculatedValueCardProps = {
  Pt: number;
  P: number;
  St: number;
  S: number;
  units: Units;
};

export default function CalculatedValueCard({
  Pt,
  P,
  St,
  S,
  units,
}: CalculatedValueCardProps) {
  const pressureUnit = unitConversions.pressure[units].unit;
  const temperatureUnit =
    units === Units.Imperial
      ? `100 ${unitConversions.temperature[units].unit}`
      : `38 ${unitConversions.temperature[units].unit}`;
  return (
    <Card sx={{ height: "100%", border: "1px solid #ddd" }}
    elevation={0}

    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Calculated Value as per B31.3 - 345.4.2
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Typography variant="body2" component="span">
            * Typically test temp is &lt; {temperatureUnit}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mt: 4,
            justifyContent: "flex-start",
          }}
        >
          <LabeledInput
            label="Test Gauge Pressure"
            symbol="P"
            unit={pressureUnit}
            value={Number(Pt.toFixed(2))}
            onChange={() => {}}
            disabled
            fullWidth
          />
        </Box>
      </CardContent>
    </Card>
  );
}
