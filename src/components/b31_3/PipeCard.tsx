"use client";

import React from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useTheme } from "@mui/material/styles";

import {Units } from "@/types/units";
import {
  npsToDnMap,
  PIPE_SCHEDULE_ORDER,
  PipeSchedule,
  unitConversions,
} from "@/utils/unitConversions";
import { Pipe } from "@/types/pipe";
import metricPipeData from "@/data/metricData.json";
import imperialPipeData from "@/data/imperialData.json";

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

const typedPipeData: TransformedPipeData = {
  Metric: metricPipeData,
  Imperial: imperialPipeData,
};

type PipeCardProps = {
  pipe: Pipe;
  units: Units; 
  updatePipe: (id: string, key: keyof Pipe, value: string | number) => void;
  removePipe: (id: string) => void;
  sx?: object;
};

export default function PipeCard({
  pipe,
  units,
  updatePipe,
  removePipe,
}: PipeCardProps) {
  const theme = useTheme();


  const thicknessConversion = unitConversions.length[units];
  const unitLabel = thicknessConversion.unit;

  const currentNpsKey =
    units === Units.Metric
      ? (npsToDnMap[pipe.nps] ?? pipe.dn).toString() 
      : pipe.nps;

  const selectedPipeSizeData = typedPipeData[units]?.[currentNpsKey];

  const scheduleOptions = selectedPipeSizeData
    ? Object.keys(selectedPipeSizeData.schedules).sort((a, b) => {
        const indexA = PIPE_SCHEDULE_ORDER.indexOf(a as PipeSchedule);
        const indexB = PIPE_SCHEDULE_ORDER.indexOf(b as PipeSchedule);
        return indexA - indexB;
      })
    : [];


  const outerDiameter = selectedPipeSizeData?.OD ?? pipe.od;

  const parseNPS = (nps: string) => {
    if (nps.includes("-")) {
      const [whole, fraction] = nps.split("-");
      const [num, denom] = fraction.split("/").map(Number);
      return Number(whole) + num / denom;
    }
    if (nps.includes("/")) {
      const [num, denom] = nps.split("/").map(Number);
      return num / denom;
    }
    return Number(nps);
  };
  const npsOptions = Object.keys(typedPipeData.Imperial).sort(
    (a, b) => parseNPS(a) - parseNPS(b)
  );

  return (

       <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" gutterBottom={false}>
            Pipe — {units === Units.Metric ? <>DN {pipe.dn}</> : <>NPS {pipe.nps}</>}, Schedule {pipe.schedule}
          </Typography>
          <IconButton
            aria-label="remove pipe"
            onClick={() => removePipe(pipe.id)}
            sx={{ color: theme.palette.error.main, p: 0.5 }}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField
            select
            label="NPS"
            value={pipe.nps}
            onChange={(e) => {
              updatePipe(pipe.id, "nps", e.target.value);
              const newNpsKey =
                units === Units.Metric
                  ? (npsToDnMap[e.target.value] ?? "").toString()
                  : e.target.value;
              const newPipeData = typedPipeData[units]?.[newNpsKey];
              if (newPipeData) {
                const firstSchedule = Object.keys(newPipeData.schedules).sort()[0];
                if (firstSchedule && !newPipeData.schedules[pipe.schedule]) {
                  updatePipe(pipe.id, "schedule", firstSchedule);
                }
              }
            }}
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
            size="small"
          >
            {npsOptions.map((npsValue) => (
              <MenuItem key={npsValue} value={npsValue}>
                {`${npsValue}" (${npsToDnMap[npsValue] || "N/A"} DN)`}
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
              <MenuItem key={sch} value={sch}>
                {sch}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField
            label={`Outer Diameter, D (${unitLabel})`}
            value={outerDiameter.toFixed(3)}
            size="small"
            disabled
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
          />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField
            label={`Required Thickness, tᵣ (${unitLabel})`}
            value={pipe.tRequired.toFixed(3)}
            size="small"
            disabled
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
          />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField
            label={`Schedule Thickness (${unitLabel})`}
            value={pipe.t.toFixed(3)}
            size="small"
            disabled
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
          />
        </Box>

        <Typography sx={{ textAlign: "right" }}>
          <strong>Result:</strong>{" "}
          {pipe.t >= pipe.tRequired ? (
            <span style={{ color: theme.palette.success.main, fontWeight: "bold" }}>
              ACCEPTABLE
            </span>
          ) : (
            <span style={{ color: theme.palette.error.main, fontWeight: "bold" }}>
              NOT ACCEPTABLE
            </span>
          )}
        </Typography>
        </Box>
  );
}
