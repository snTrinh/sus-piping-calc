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

import { Units } from "@/types/units";
import { npsToMmMap, unitConversions } from "@/utils/unitConversions";
import pipeData from "@/data/transformed_pipeData.json"; // Ensure this path is correct

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
const typedPipeData: TransformedPipeData = pipeData as any; // Using 'as any' for quick setup, consider stricter typing

type Pipe = {
  id: string;
  nps: string;
  schedule: string;
  tRequired: number; // stored internally in inches
  t: number; // stored internally in inches (user provided thickness) - Note: This field is not currently used in the component.
};

type PipeCardProps = {
  pipe: Pipe;
  updatePipe: (id: string, key: keyof Pipe, value: string | number) => void;
  removePipe: (id: string) => void;
  units: Units;
  sx?: object;
};

export default function PipeCard({
  pipe,
  updatePipe,
  removePipe,
  units,
  sx
}: PipeCardProps) {
  const theme = useTheme();

  const thicknessConversion = unitConversions.length[units];
  const unitLabel = thicknessConversion.unit;

  // Determine the correct NPS key for the current unit system based on transformed_pipeData.json
  // For Metric, the NPS from pipe.nps (e.g., "4") needs to be converted to its corresponding DN number string (e.g., "100")
  const currentNpsKey = units === Units.Metric ? npsToMmMap[pipe.nps]?.toString() : pipe.nps;

  console.log("--- PipeCard Debug ---");
  console.log("Pipe ID:", pipe.id);
  console.log("Selected NPS (pipe.nps):", pipe.nps);
  console.log("Selected Schedule (pipe.schedule):", pipe.schedule);
  console.log("Current Units:", units);
  console.log("Derived currentNpsKey (for data lookup):", currentNpsKey);


  // Get the data for the currently selected unit system (Metric or Imperial)
  const currentUnitPipeData = typedPipeData[units];
  console.log("currentUnitPipeData exists:", !!currentUnitPipeData);


  // Get the specific pipe size data (e.g., data for "1/2" NPS or "100" DN)
  // Use empty string fallback for currentNpsKey to prevent errors if undefined
  const selectedPipeSizeData = currentUnitPipeData?.[currentNpsKey || ''];
  console.log("selectedPipeSizeData exists:", !!selectedPipeSizeData);
  if (selectedPipeSizeData) {
      console.log("selectedPipeSizeData.OD (raw from JSON):", selectedPipeSizeData.OD);
      console.log("selectedPipeSizeData.schedules (raw from JSON):", selectedPipeSizeData.schedules);
  }


  // Dynamically get schedule options based on the selected pipe size and current unit system
  const scheduleOptions = selectedPipeSizeData ? Object.keys(selectedPipeSizeData.schedules).sort() : []; // Added .sort() for consistent order
  console.log("Available schedule options for current NPS:", scheduleOptions);


  // Look up the raw thickness directly from selectedPipeSizeData
  let rawScheduleThickness: number = 0;
  if (selectedPipeSizeData && selectedPipeSizeData.schedules && pipe.schedule in selectedPipeSizeData.schedules) {
    const fetchedThickness = selectedPipeSizeData.schedules[pipe.schedule];
    rawScheduleThickness = fetchedThickness === null ? 0 : fetchedThickness;
    console.log(`Fetched rawScheduleThickness for schedule '${pipe.schedule}':`, fetchedThickness);
  } else {
      console.log(`Could not find schedule thickness for NPS '${currentNpsKey}' and Schedule '${pipe.schedule}'.`);
      // If schedule isn't found, you might want to default to the first available or a specific schedule
      // For now, it will remain 0.
  }

  // Normalize the raw thickness to your internal standard unit (inches)
  let thicknessInInches = 0;
  if (units === Units.Metric && rawScheduleThickness) {
    // The metric data is in mm, so convert it to inches
    thicknessInInches = unitConversions.length.Metric.from(rawScheduleThickness);
  } else {
    // The imperial data is already in inches
    thicknessInInches = rawScheduleThickness;
  }
  console.log("thicknessInInches (converted to internal standard):", thicknessInInches);

  // Now, calculate the displayed values from your consistent internal units (inches)
  const displayedScheduleThickness = thicknessConversion.to(thicknessInInches);
  const displayedTRequired = unitConversions.length[units].to(pipe.tRequired);
  console.log(`Displayed Schedule Thickness (${unitLabel}):`, displayedScheduleThickness);
  console.log(`Displayed Required Thickness (${unitLabel}):`, displayedTRequired);


  // Look up the outer diameter directly from selectedPipeSizeData
  const outerDiameter = selectedPipeSizeData?.OD || 0;
  console.log("Outer Diameter (raw from JSON):", outerDiameter);


  // Get all available NPS options, sorted.
  // We derive this from the Imperial section of the transformed_pipeData.json
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
          {thicknessInInches >= pipe.tRequired ? (
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