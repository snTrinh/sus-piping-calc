"use client";

import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles"; // Import useTheme

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
  const theme = useTheme(); // Access the theme object

  return (
    <Card
      sx={{
        flex: 1, // Allows card to grow and shrink
        minWidth: { xs: "auto", md: 450 }, // Auto width on small, min 450px on md+
        display: "flex", // Make card a flex container for its content
        flexDirection: "column", // Stack content vertically inside card
        height: 250,
        border: "1px solid #ddd", // Add border if desired
      }}
      elevation={0} // Ensure consistent elevation
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Interpolated Value
        </Typography>
        <Typography variant="body1" gutterBottom paddingTop={1}>
          (x₀, y₀) = ({x0}, {y0})<br />
          (x₁, y₁) = ({x1}, {y1})<br />
        </Typography>
        {/* Formula Display */}
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
                  borderBottom: `1px solid ${theme.palette.text.primary}`, // CHANGED to themed color
                  px: 0.5,
                }}
              >
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
              <Box
                sx={{
                  borderBottom: `1px solid ${theme.palette.text.primary}`, // CHANGED to themed color
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
