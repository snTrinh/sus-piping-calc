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

import { DesignParams, Units } from "@/types/units"; 
import { npsToMmMap, PIPE_SCHEDULE_ORDER, PipeSchedule, unitConversions } from "@/utils/unitConversions";
import pipeData from "@/data/transformed_pipeData.json"; 
import { calculateTRequired, TRequiredParams } from "@/utils/pipeCalculations"; 
import { useAppSelector } from "@/state/store";
import { Pipe } from "@/types/pipe";

interface ScheduleThicknesses {
  [key: string]: number | null;
}

interface PipeSizeData {
  OD: number;
  schedules: ScheduleThicknesses;
}

interface TransformedPipeData {
  Metric: { [key: string]: PipeSizeData };
  Imperial: { [key: string]: PipeSizeData };
}

const typedPipeData: TransformedPipeData = pipeData; 

type PipeCardProps = {
  pipe: Pipe;
  updatePipe: (id: string, key: keyof Pipe, value: string | number) => void;
  removePipe: (id: string) => void;
  designParams: DesignParams;
  sx?: object;
};

export default function PipeCard({
  pipe,
  updatePipe,
  removePipe,
  designParams,
  sx
}: PipeCardProps) {
  const theme = useTheme();
  const units = useAppSelector((state) => state.unit.currentUnit);
  const { pressure, allowableStress, corrosionAllowance, e, w, gamma } = designParams;

  const thicknessConversion = unitConversions.length[units];
  const unitLabel = thicknessConversion.unit;

  // Select pipe size data
  const currentNpsKey = units === Units.Metric ? npsToMmMap[pipe.nps]?.toString() : pipe.nps;
  const currentUnitPipeData = typedPipeData[units];
  const selectedPipeSizeData = currentUnitPipeData?.[currentNpsKey || ''];

  const scheduleOptions = selectedPipeSizeData
    ? Object.keys(selectedPipeSizeData.schedules).sort((a, b) => {
        const indexA = PIPE_SCHEDULE_ORDER.indexOf(a as PipeSchedule); 
        const indexB = PIPE_SCHEDULE_ORDER.indexOf(b as PipeSchedule);
        return indexA - indexB;
      })
    : [];

  // Get schedule thickness
  let rawScheduleThickness = 0;
  if (selectedPipeSizeData && selectedPipeSizeData.schedules && pipe.schedule in selectedPipeSizeData.schedules) {
    const fetchedThickness = selectedPipeSizeData.schedules[pipe.schedule];
    rawScheduleThickness = fetchedThickness ?? 0;
  }

  // Convert thickness to current units
  const thicknessInInches = units === Units.Metric ? unitConversions.length.Metric.toImperial(rawScheduleThickness) : rawScheduleThickness;
  const displayedScheduleThickness = thicknessConversion.to(thicknessInInches);

  // Outer diameter
  const outerDiameterDisplay = selectedPipeSizeData?.OD || 0;
  const outerDiameterInches = units === Units.Metric ? unitConversions.length.Metric.toImperial(outerDiameterDisplay) : outerDiameterDisplay;

  const paramsForCalculation: TRequiredParams = {
    pressure,                
    outerDiameterInches,
    allowableStress,   
    e ,
    w,
    gamma,
    corrosionAllowance,
    millTol: designParams.millTol,
  };

  // Calculate required thickness
  const tRequiredCalculatedImperial = calculateTRequired(paramsForCalculation);
  const displayedTRequired = thicknessConversion.to(tRequiredCalculatedImperial);

  // NPS options for dropdown
  const npsOptions = Object.keys(typedPipeData.Imperial).sort((a, b) => {
    const toNumber = (val: string) => {
      if (val.includes(" ")) { 
        const [whole, fraction] = val.split(" ");
        const [num, denom] = fraction.split("/").map(Number);
        return Number(whole) + num / denom;
      } else if (val.includes("/")) { 
        const [num, denom] = val.split("/").map(Number);
        return num / denom;
      } else { 
        return Number(val);
      }
    };
    return toNumber(a) - toNumber(b);
  });

  return (
    <Card sx={{ flex: 1, borderRadius: 2, border: "1px solid #ddd", boxShadow: "none", position: "relative", minWidth: 450, ...sx }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" gutterBottom={false}>
            Pipe — NPS {pipe.nps}, Schedule {pipe.schedule}
          </Typography>
          <IconButton aria-label="remove pipe" onClick={() => removePipe(pipe.id)} sx={{ color: theme.palette.error.main, p: 0.5 }}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField
            select
            label={`NPS`}
            value={pipe.nps}
            onChange={(e) => {
              updatePipe(pipe.id, "nps", e.target.value);
              const newNpsKey = units === Units.Metric ? npsToMmMap[e.target.value]?.toString() : e.target.value;
              const newSelectedPipeSizeData = typedPipeData[units]?.[newNpsKey || ''];
              if (newSelectedPipeSizeData) {
                const firstNewSchedule = Object.keys(newSelectedPipeSizeData.schedules).sort()[0];
                if (firstNewSchedule && !newSelectedPipeSizeData.schedules[pipe.schedule]) {
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
            disabled={!selectedPipeSizeData || scheduleOptions.length === 0}
            size="small"
          >
            {scheduleOptions.map((sch) => (
              <MenuItem key={sch} value={sch}>{sch}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField label={`Outer Diameter, D (${unitLabel})`} value={outerDiameterDisplay.toFixed(2)} size="small" disabled sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }} />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField label={`Required Thickness, tᵣ (${unitLabel})`} value={displayedTRequired.toFixed(3)} size="small" disabled sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }} />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField label={`Schedule Thickness (${unitLabel})`} value={displayedScheduleThickness.toFixed(3)} size="small" disabled sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }} />
        </Box>

        <Typography sx={{ textAlign: "right" }}>
          <strong>Result:</strong>{" "}
          {thicknessInInches >= tRequiredCalculatedImperial ? (
            <span style={{ color: theme.palette.success.main, fontWeight: "bold" }}>ACCEPTABLE</span>
          ) : (
            <span style={{ color: theme.palette.error.main, fontWeight: "bold" }}>NOT ACCEPTABLE</span>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}
