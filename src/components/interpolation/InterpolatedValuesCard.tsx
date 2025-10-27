"use client";

import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles"; 

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
  const theme = useTheme(); 

  return (
    <Card
      sx={{
        flex: 1, 
        minWidth: { xs: "auto", md: 450 }, 
        display: "flex", 
        flexDirection: "column",
        height: 250,
        border: "1px solid #ddd", 
      }}
      elevation={0}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Interpolated Value
        </Typography>
        <Typography variant="body1" gutterBottom paddingTop={1}>
          (x₀, y₀) = ({x0}, {y0})<br />
          (x₁, y₁) = ({x1}, {y1})<br />
        </Typography>

        <Box>
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
              <Box
                sx={{
                  borderBottom: `1px solid ${theme.palette.text.primary}`, 
                  px: 0.5,
                }}
              >
                y₁ − y₀
              </Box>
              <Box sx={{ px: 0.5 }}>x₁ − x₀</Box>
            </Box>
          </Box>

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
              <Box
                sx={{
                  borderBottom: `1px solid ${theme.palette.text.primary}`, 
                  px: 0.5,
                }}
              >
                {y1} − {y0}
              </Box>
              <Box sx={{ px: 0.5 }}>
                {x1} − {x0}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="y"
            type="number"
            fullWidth
            value={y.toFixed(2)}
            disabled
            sx={{
              mt: 1,
            }}
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
