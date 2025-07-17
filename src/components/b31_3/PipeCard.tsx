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
  IconButton,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useTheme } from "@mui/material/styles";

import { DesignParams, Units } from "@/types/units"; // Import DesignParams
import { npsToMmMap, PIPE_SCHEDULE_ORDER, unitConversions } from "@/utils/unitConversions";
import pipeData from "@/data/transformed_pipeData.json"; // Ensure this path is correct
import { calculateTRequired, TRequiredParams } from "@/utils/pipeCalculations"; // Import the utility function and its types

// Define the structure of your new pipeData.json for better type safety
interface ScheduleThicknesses {
  [key: string]: number | null; // Schedule names map to thickness (number) or null
}

interface PipeSizeData {
  OD: number;
  schedules: ScheduleThicknesses;
}

interface TransformedPipeData {
  Metric: {
    [key: string]: PipeSizeData; // NPS/DN as string keys (e.g. "10", "13"), mapping to PipeSizeData
  };
  Imperial: {
    [key: string]: PipeSizeData; // NPS as string keys (e.g., "1/8", "1"), mapping to PipeSizeData
  };
}

// Cast pipeData to the new interface
const typedPipeData: TransformedPipeData = pipeData; // Using 'as any' for quick setup, consider stricter typing

type Pipe = {
  id: string;
  nps: string;
  schedule: string;
  tRequired: number; // stored internally in inches - this will now be overwritten by local calculation for display
  t: number; // stored internally in inches (user provided thickness) - Note: This field is not currently used in the component.
};

type PipeCardProps = {
  pipe: Pipe;
  updatePipe: (id: string, key: keyof Pipe, value: string | number) => void;
  removePipe: (id: string) => void;
  designParams: DesignParams; // Add designParams to props
  sx?: object;
};

export default function PipeCard({
  pipe,
  updatePipe,
  removePipe,
  designParams, // Destructure designParams
  sx
}: PipeCardProps) {
  const theme = useTheme();

  const { pressure, corrosionAllowance, allowableStress, e, w, gamma, units } =
    designParams; // Destructure units here

  const thicknessConversion = unitConversions.length[units];
  const pressureConversion = unitConversions.pressure[units]; // Get pressure conversion
  const unitLabel = thicknessConversion.unit;

  const currentNpsKey = units === Units.Metric ? npsToMmMap[pipe.nps]?.toString() : pipe.nps;

  const currentUnitPipeData = typedPipeData[units];


  const selectedPipeSizeData = currentUnitPipeData?.[currentNpsKey || ''];


const scheduleOptions = selectedPipeSizeData
    ? Object.keys(selectedPipeSizeData.schedules).sort((a, b) => {
        const indexA = PIPE_SCHEDULE_ORDER.indexOf(a as any); // Cast to any to match PipeSchedule type
        const indexB = PIPE_SCHEDULE_ORDER.indexOf(b as any);
        return indexA - indexB;
      })
    : [];

  let rawScheduleThickness: number = 0;
  if (selectedPipeSizeData && selectedPipeSizeData.schedules && pipe.schedule in selectedPipeSizeData.schedules) {
    const fetchedThickness = selectedPipeSizeData.schedules[pipe.schedule];
    rawScheduleThickness = fetchedThickness === null ? 0 : fetchedThickness;

  }

  // Normalize the raw thickness to your internal standard unit (inches)
  let thicknessInInches = 0;
  if (units === Units.Metric && rawScheduleThickness) {
    // The metric data is in mm, so convert it to inches
    thicknessInInches = unitConversions.length.Metric.toImperial(rawScheduleThickness);
  } else {
    // The imperial data is already in inches
    thicknessInInches = rawScheduleThickness;
  }

  const displayedScheduleThickness = thicknessConversion.to(thicknessInInches);
  const outerDiameterDisplay = selectedPipeSizeData?.OD || 0;
  const imperialPressure = pressureConversion.toImperial(pressure);
  const imperialAllowableStress = pressureConversion.toImperial(allowableStress ?? 0);
  const imperialCorrosionAllowance = thicknessConversion.toImperial(corrosionAllowance);

  // outerDiameterDisplay is in the current display unit. Convert to Imperial (inches) if Metric.
  const imperialOuterDiameter = units === Units.Metric
    ? unitConversions.length[Units.Metric].toImperial(outerDiameterDisplay)
    : outerDiameterDisplay; 
  const paramsForCalculation: TRequiredParams = {
    pressure: imperialPressure,
    outerDiameterInches: imperialOuterDiameter,
    allowableStress: imperialAllowableStress,
    e: e ?? 1, // Ensure E, W, gamma have default values if null/undefined
    w: w ?? 1,
    gamma: gamma ?? 1,
    corrosionAllowanceInches: imperialCorrosionAllowance,
    millTol: designParams.millTol ?? 0,
  };

  // Calculate tRequired using the utility function (result will be in Imperial inches)
  const tRequiredCalculatedImperial = calculateTRequired(paramsForCalculation);

  // Convert the calculated tRequired back to the current display units for rendering
  const displayedTRequired = thicknessConversion.to(tRequiredCalculatedImperial);

  const npsOptions = Object.keys(typedPipeData.Imperial)
    .sort((a, b) => {
      // Custom sorting for mixed fractional and whole number NPS values
      const toNumber = (val: string) => {
        if (val.includes(" ")) { // Handle "X Y/Z" (e.g., "1-1/4")
          const [whole, fraction] = val.split(" ");
          const [num, denom] = fraction.split("/").map(Number);
          return Number(whole) + num / denom;
        } else if (val.includes("/")) { // Handle "X/Y" (e.g., "1/8")
          const [num, denom] = val.split("/").map(Number);
          return num / denom;
        } else { // Handle whole numbers (e.g., "1", "2")
          return Number(val);
        }
      };
      return toNumber(a) - toNumber(b);
    });

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid #ddd",
        boxShadow: "none",
        position: "relative",
        ...sx
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" gutterBottom={false}>
            Pipe — NPS {pipe.nps}, Schedule {pipe.schedule}
          </Typography>
          <IconButton
            aria-label="remove pipe"
            onClick={() => removePipe(pipe.id)}
            sx={{
              color: theme.palette.error.main,
              p: 0.5,
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
          }}
        >
          <TextField
            select
            label={`NPS`}
            value={pipe.nps}
            onChange={(e) => {
              updatePipe(pipe.id, "nps", e.target.value);
              // When NPS changes, also ensure schedule is reset to a valid default if necessary
              // This is a common point of error where schedule becomes stale
              // You might want to update the schedule to the first available option for the new NPS
              const newNpsKey = units === Units.Metric ? npsToMmMap[e.target.value]?.toString() : e.target.value;
              const newSelectedPipeSizeData = typedPipeData[units]?.[newNpsKey || ''];
              if (newSelectedPipeSizeData) {
                const firstNewSchedule = Object.keys(newSelectedPipeSizeData.schedules).sort()[0];
                if (firstNewSchedule && !newSelectedPipeSizeData.schedules[pipe.schedule]) {
                  // Only update if current schedule is not valid for new NPS
                  updatePipe(pipe.id, "schedule", firstNewSchedule);
                }
              }
            }}
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
            size="small"
          >
            {npsOptions.map((npsValue) => (
              <MenuItem key={npsValue} value={npsValue}>
                {`${npsValue}" (${npsToMmMap[npsValue] || 'N/A'} DN)`}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Schedule"
            value={pipe.schedule}
            onChange={(e) => updatePipe(pipe.id, "schedule", e.target.value)}
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
            // Disable schedule if no pipe size data is found or no schedules are available for it
            disabled={!selectedPipeSizeData || scheduleOptions.length === 0}
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
          }}
        >
          <TextField
            label={`Outer Diameter, D (${unitLabel})`}
            value={outerDiameterDisplay.toFixed(2)} // Use outerDiameterDisplay
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
          }}
        >
          <TextField
            label={`Required Thickness, tᵣ (${unitLabel})`}
            value={displayedTRequired.toFixed(3)} // Use the newly calculated value
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

        <Typography sx={{ textAlign: "right" }}>
          <strong>Result:</strong>{" "}
          {/* Compare internal inch values for accuracy */}
          {thicknessInInches >= tRequiredCalculatedImperial ? ( // Compare with the imperial calculated value
            <span style={{ color: theme.palette.success.main, fontWeight: "bold" }}>
              ACCEPTABLE
            </span>
          ) : (
            <span style={{ color: theme.palette.error.main, fontWeight: "bold" }}>
              NOT ACCEPTABLE
            </span>
          )}
        </Typography>

      </CardContent>
    </Card>
  );
}
