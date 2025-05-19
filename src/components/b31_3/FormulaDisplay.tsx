import React from "react";
import { Box, Typography } from "@mui/material";
import { Units } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions"; // adjust import path as needed

type FormulaDisplayProps = {
  showValues?: boolean;
  designPressure?: number;
  stress?: number;
  e?: number;
  w?: number;
  gamma?: number;
  ca?: number;
  millTolerance?: number;
  diameter?: number;
  units: Units;
};

export default function FormulaDisplay({
  showValues = false,
  designPressure,
  stress,
  e,
  w,
  gamma,
  ca,
  millTolerance,
  diameter,
  units,
}: FormulaDisplayProps) {
  const pressureUnit = unitConversions.pressure[units].unit;
  const thicknessUnit = unitConversions.thickness[units].unit;

  const pressureDisplay = designPressure?.toFixed(2);
  const diameterDisplay = diameter?.toFixed(2);
  const stressDisplay = stress?.toFixed(2);
  const caDisplay = ca?.toFixed(2);
  const millTolDisplay = millTolerance?.toFixed(3);

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", p: 2, borderRadius: 1, mb: 3 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
      >
        <strong>Required Thickness (ASME B31.3):</strong>{" "}
        <Typography variant="body2" component="span" sx={{ ml: 1 }}>
          tᵣ = (
        </Typography>
        {/* Main Fraction */}
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "0.875rem",
            lineHeight: 1,
            ml: 1,
          }}
        >
          {/* Numerator */}
          <Box
            sx={{
              borderBottom: "1px solid #000",
              px: 0.5,
              textAlign: "center",
            }}
          >
            {showValues
              ? `(${pressureDisplay} ${pressureUnit} × ${diameterDisplay} ${thicknessUnit})`
              : "(P × D)"}
          </Box>

          {/* Denominator */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              px: 0.5,
              mt: 0.2,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              {showValues
                ? `[2((${stressDisplay} ${pressureUnit})(${e})(${w}) + (${pressureDisplay} ${pressureUnit})(${gamma}))]`
                : "[2(SEW + Pγ)]"}
            </Box>
          </Box>
        </Box>
        {/* CA */}
        <Typography
          variant="body2"
          component="span"
          sx={{ ml: 0.5, whiteSpace: "nowrap" }}
        >
          {showValues ? `+ ${caDisplay} ${thicknessUnit} ) x` : "+ CA ) x"}
        </Typography>

        {/* Mill tolerance as fraction */}
        <Typography variant="body2" component="span" sx={{ ml: 1, display: "inline-flex", flexDirection: "column", alignItems: "center", fontSize: "0.875rem", lineHeight: 1 }}>
          
          <Box
            sx={{
              borderBottom: "1px solid #000",
              px: 0.5,
              textAlign: "center",
              mt: 0.3,
            }}
          >
            1
          </Box>
          <Box sx={{ px: 0.5, mt: 0.2, textAlign: "center" }}>
            {showValues ? `(1 - ${millTolDisplay})` : "(1 - Mill Tolerance)"}
          </Box>
        </Typography>
      </Typography>
    </Box>
  );
}
