import React from "react";
import { Box, Typography } from "@mui/material";

export default function FormulaDisplay() {


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
            {"(P × D)"}
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
              {"[2(SEW + Pγ)]"}
            </Box>
          </Box>
        </Box>
        {/* CA */}
        <Typography
          variant="body2"
          component="span"
          sx={{ ml: 0.5, whiteSpace: "nowrap" }}
        >
          { "+ CA ) x"}
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
            {"(1 - Mill Tolerance)"}
          </Box>
        </Typography>
      </Typography>
    </Box>
  );
}
