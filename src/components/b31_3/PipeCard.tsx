// src/app/b31.3-calculator/PipeCard.tsx
"use client";
import React from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Card,
  CardContent,
  IconButton, // Import IconButton
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useTheme } from "@mui/material/styles"; // Import useTheme for theme colors

import { Units } from "@/types/units";
import { npsToMmMap, unitConversions } from "@/utils/unitConversions";
import pipeData from "@/data/pipeData.json";
import pipeDimensions from "@/data/transformed_pipeData.json";

type Pipe = {
  id: string;
  nps: string;
  schedule: string;
  tRequired: number; // stored internally in inches
  t: number; // stored internally in inches (user provided thickness)
};

type PipeCardProps = {
  pipe: Pipe;
  updatePipe: (id: string, key: keyof Pipe, value: string | number) => void;
  removePipe: (id: string) => void;
  units: Units;
  sx?: object; // Added sx prop for consistency with other cards
};

const scheduleOptions = ["5", "10", "40", "80"];

export default function PipeCard({
  pipe,
  updatePipe,
  removePipe,
  units,
  sx // Destructure sx prop
}: PipeCardProps) {
  const theme = useTheme(); // Use theme for colors

  // @ts-expect-error this is required
  const rawThickness = pipeDimensions["Imperial"][pipe.nps]?.schedules[pipe.schedule] ?? 0;

  const thicknessConversion = unitConversions.length[units];
  const unitLabel = thicknessConversion.unit;

  const displayedTRequired = unitConversions.length[units].to(pipe.tRequired);
  const displayedScheduleThickness = thicknessConversion.to(rawThickness);

  const targetNps = units === Units.Metric ? npsToMmMap[pipe.nps] : pipe.nps;
  const outerDiameter =
    pipeData[units]?.columns?.find((col) => col.NPS === targetNps)?.OD || 0;

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid #ddd",
        boxShadow: "none",
        position: "relative", // Essential for absolute positioning of the icon
        ...sx // Apply any custom sx prop passed to this Card
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}> {/* Added flex properties to CardContent for consistent spacing */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // mb: 2, // Removed mb here, let CardContent gap handle spacing
          }}
        >
          <Typography variant="h6" gutterBottom={false}> {/* Set gutterBottom to false to let the Box handle spacing */}
            Pipe — NPS {pipe.nps}, Schedule {pipe.schedule}
          </Typography>
          <IconButton
            aria-label="remove pipe"
            onClick={() => removePipe(pipe.id)}
            sx={{
              color: theme.palette.error.main, // Use theme error color for the icon
              p: 0.5, // Smaller padding for the icon button itself
              // If you want it absolutely positioned *outside* the flow of the header,
              // uncomment the lines below and adjust top/right as needed.
              // This current setup places it within the header flex container.
              // position: 'absolute',
              // top: 8,
              // right: 8,
            }}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            // mb: 2, // Removed mb here, let CardContent gap handle spacing
          }}
        >
          <TextField
            select
            label={`NPS (${unitLabel})`}
            value={pipe.nps}
            onChange={(e) => updatePipe(pipe.id, "nps", e.target.value)}
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
            size="small"
          >
            {Object.entries(npsToMmMap)
              .sort(([a], [b]) => {
                const toNumber = (val: string) => {
                  if (val.includes(" ")) {
                    // Handle mixed fractions like "1 1/4"
                    const [whole, fraction] = val.split(" ");
                    const [num, denom] = fraction.split("/").map(Number);
                    return Number(whole) + num / denom;
                  } else if (val.includes("/")) {
                    // Handle simple fractions like "3/4"
                    const [num, denom] = val.split("/").map(Number);
                    return num / denom;
                  } else {
                    // Handle whole numbers
                    return Number(val);
                  }
                };

                return toNumber(a) - toNumber(b);
              })
              .map(([Imperial, Metric]) => (
                <MenuItem key={Imperial} value={Imperial}>
                  {units === Units.Metric ? Metric : Imperial}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            select
            label="Schedule"
            value={pipe.schedule}
            onChange={(e) => updatePipe(pipe.id, "schedule", e.target.value)}
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
            size="small"
          >
            {scheduleOptions.map((sch) => (
              <MenuItem key={sch} value={sch}>
                {sch}
              </MenuItem>
            ))}
          </TextField>

        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            // mb: 2, // Removed mb here, let CardContent gap handle spacing
          }}
        >
         

          <TextField
            label={`Outer Diameter, D (${unitLabel})`}
            value={outerDiameter.toFixed(2)}
            size="small"
            disabled
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
          />

          
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            // mb: 2, // Removed mb here, let CardContent gap handle spacing
          }}
        >
         

         
          <TextField
            label={`Required Thickness, tᵣ (${unitLabel})`}
            value={displayedTRequired.toFixed(3)}
            size="small"
            disabled
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
          />


        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            // mb: 2, // Removed mb here, let CardContent gap handle spacing
          }}
        >
         

         
          <TextField
            label={`Schedule Thickness (${unitLabel})`}
            value={displayedScheduleThickness.toFixed(3)}
            size="small"
            disabled
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
          />
        </Box>

        <Typography sx={{ textAlign: "right" }}> {/* Removed mb: 2, let CardContent gap handle spacing */}
          <strong>Result:</strong>{" "}
          {displayedScheduleThickness >= displayedTRequired ? (
            <span style={{ color: theme.palette.success.main, fontWeight: "bold" }}>
              ACCEPTABLE
            </span>
          ) : (
            <span style={{ color: theme.palette.error.main, fontWeight: "bold" }}>
              NOT ACCEPTABLE
            </span>
          )}
        </Typography>

        {/* The original "Remove Pipe" button. It's now below the main content. */}
        {/* <Button
          startIcon={<RemoveCircleOutlineIcon />}
          variant="outlined"
          color="error"
          size="small"
          onClick={() => removePipe(pipe.id)}
          sx={{
            whiteSpace: "nowrap",
            height: "40px",
            alignSelf: "flex-end", // Align to the right within the flex column
            minWidth: 140,
            // mt: 2, // Removed mt, let CardContent gap handle spacing
          }}
        >
          Remove Pipe
        </Button> */}
      </CardContent>
    </Card>
  );
}
