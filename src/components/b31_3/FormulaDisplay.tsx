import React from "react";
import { Box, Typography } from "@mui/material";

export default function FormulaDisplay() {
  return (
    <Box
      sx={{
        backgroundColor: "#f9f9f9",
        p: 2,
        borderRadius: 1,
        mb: 3,
        overflowX: "auto",
      }}
    >
      {/* Label */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: "bold", mb: 1 }}
      >
        Required Thickness (ASME B31.3):
      </Typography>

      {/* Formula */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 0.5,
          fontSize: { xs: "0.8rem", sm: "0.875rem" },
        }}
      >
        <Typography variant="body2" component="span" sx={{ whiteSpace: "nowrap" }}>
          tᵣ = (
        </Typography>

        {/* Main Fraction */}
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            lineHeight: 1,
          }}
        >
          {/* Numerator */}
          <Box
            sx={{
              borderBottom: "1px solid #000",
              px: 0.5,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            (P × D)
          </Box>

          {/* Denominator */}
          <Box
            sx={{
              px: 0.5,
              mt: 0.2,
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            [2(SEW + Pγ)]
          </Box>
        </Box>

        {/* CA */}
        <Typography variant="body2" component="span" sx={{ whiteSpace: "nowrap" }}>
          + CA )
        </Typography>

        {/* Multiplier "x" */}
        <Typography variant="body2" component="span" sx={{ whiteSpace: "nowrap" }}>
          ×
        </Typography>

        {/* Mill tolerance fraction */}
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            lineHeight: 1,
            whiteSpace: "nowrap",
            ml: 1,
          }}
        >
          <Box
            sx={{
              borderBottom: "1px solid #000",
              px: 0.5,
              mt: 0.3,
              textAlign: "center",
            }}
          >
            1
          </Box>
          <Box sx={{ px: 0.5, mt: 0.2, textAlign: "center" }}>
            (1 - Mill Tolerance)
          </Box>
        </Box>
      </Typography>
    </Box>
  );
}
