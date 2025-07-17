// src/app/FormulaDisplay.tsx
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

import { DesignParams } from "@/types/units";

interface FormulaDisplayProps {
  designParams?: DesignParams;
}

export default function FormulaDisplay({ designParams }: FormulaDisplayProps) {
  const theme = useTheme(); // Access the current theme
  const e = designParams?.e ?? 1;
  const w = designParams?.w ?? 1;
  const gamma = designParams?.gamma ?? 0.4;
  const millTol = designParams?.millTol ?? 0.125;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        p: 2,
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: "bold", mb: 1 }}
      >
        Max Allowable Pressure:
      </Typography>

      <Typography
        component="div"
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
        <Typography
          variant="body2"
          component="span"
          sx={{ whiteSpace: "nowrap" }}
        >
          Pmax = 
        </Typography>

        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            lineHeight: 1,
          }}
        >
          <Box
            sx={{
              // Apply !important to ensure this border color overrides any conflicting rules
              borderBottom: `1px solid ${theme.palette.text.primary} !important`,
              px: 0.5,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            2St
          </Box>

          <Box
            sx={{
              px: 0.5,
              mt: 0.2,
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            D
          </Box>
        </Box>

        <Typography
          variant="body2"
          component="span"
          sx={{ whiteSpace: "nowrap" }}
        >
          x F x L x J x T
        </Typography>
      </Typography>

      {/* Label */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: "bold", mb: 1, mt: 2 }}
      >
        Assumptions:
      </Typography>

      <Typography
        component="div"
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
        <Typography
          variant="body2"
          component="span"
          sx={{ whiteSpace: "nowrap" }}
        >
          Design Factor, F = <strong>{e}</strong>
        </Typography>
      </Typography>

      <Typography
        component="div"
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
        <Typography
          variant="body2"
          component="span"
          sx={{ whiteSpace: "nowrap" }}
        >
          Location Factor, L = <strong>{w}</strong>
        </Typography>
      </Typography>

      <Typography
        component="div"
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
        <Typography
          variant="body2"
          component="span"
          sx={{ whiteSpace: "nowrap" }}
        >
          Joint Factor, J = <strong>{gamma}</strong>
        </Typography>
      </Typography>

      <Typography
        component="div"
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
        <Typography
          variant="body2"
          component="span"
          sx={{ whiteSpace: "nowrap" }}
        >
          Temperature Factor, T = <strong>{millTol}</strong>
        </Typography>
      </Typography>
    </Box>
  );
}