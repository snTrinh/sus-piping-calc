import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "@/state/store";

export default function FormulaDisplay() {
  const theme = useTheme();
  const e = useAppSelector((state) => state.single.global.e);
  const w = useAppSelector((state) => state.single.global.w);
  const gamma = useAppSelector((state) => state.single.global.gamma);
  const millTol = useAppSelector((state) => state.single.global.millTol);
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
        Required Thickness (ASME B31.3):
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
          tᵣ = (
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
              borderBottom: `1px solid ${theme.palette.text.primary} !important`,
              px: 0.5,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            (P × D)
          </Box>

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

        <Typography
          variant="body2"
          component="span"
          sx={{ whiteSpace: "nowrap" }}
        >
          + CA )
        </Typography>

        <Typography
          variant="body2"
          component="span"
          sx={{ whiteSpace: "nowrap" }}
        >
          ×
        </Typography>

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
              borderBottom: `1px solid ${theme.palette.text.primary} !important`,
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
          Weld Joint Efficiency, E = <strong>{e}</strong>
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
          Weld Strength Reduction Factor, W = <strong>{w}</strong>
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
          Temperature Coefficient, &gamma; = <strong>{gamma}</strong>
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
          Mill Tolerance Factor, % = <strong>{millTol * 100}%</strong>
        </Typography>
      </Typography>
    </Box>
  );
}
