import React from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Units } from "@/types/units";
import { npsToMmMap, unitConversions } from "@/utils/unitConversions";
import pipeData from "@/utils/pipeData.json";
import pipeDimensions from "@/utils/transformed_pipeData.json";
type Pipe = {
  id: string;
  nps: string;
  schedule: string;
  tRequired: number;
  t: number;
};

type PipeCardProps = {
  pipe: Pipe;
  thicknessByNpsSchedule: any;
  updatePipe: (id: string, key: keyof Pipe, value: any) => void;
  removePipe: (id: string) => void;
  units: Units;
};

const scheduleOptions = ["5", "10", "40", "80"];

export default function PipeCard({
  pipe,
  thicknessByNpsSchedule,
  updatePipe,
  removePipe,
  units,
}: PipeCardProps) {
  // const rawThickness = thicknessByNpsSchedule[pipe.nps]?.[pipe.schedule] ?? 0;

  const rawThickness =
    pipeDimensions[units][pipe.nps]?.schedules[pipe.schedule];

  const thicknessConversion = unitConversions.length[units];
  const displayedThickness = thicknessConversion.to(rawThickness);
  const unitLabel = thicknessConversion.unit;
  const outerDiameter =
    pipeData[units]?.columns?.find((col) => col.NPS === pipe.nps)?.OD || 0;

  return (
    <Card
      sx={{
        mb: 4,
        borderRadius: 2,
        border: "1px solid #ddd",
        boxShadow: "none",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Pipe — NPS {pipe.nps}, Schedule {pipe.schedule}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mb: 2,
          }}
        >
          <TextField
            select
            label="NPS"
            value={pipe.nps}
            onChange={(e) => updatePipe(pipe.id, "nps", e.target.value)}
            sx={{ minWidth: 120 }}
            size="small"
          >
            {Object.entries(npsToMmMap).map(([Imperial, Metric]) => (
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
            sx={{ minWidth: 120 }}
            size="small"
          >
            {scheduleOptions.map((sch) => (
              <MenuItem key={sch} value={sch}>
                {sch}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={`Outer Diameter, D (${unitLabel})`}
            value={outerDiameter.toFixed(2)}
            size="small"
            disabled
            sx={{ minWidth: 120 }}
          />
          <TextField
            label={`Provided Thickness, t (${unitLabel})`}
            value={displayedThickness.toFixed(3)}
            size="small"
            disabled
            sx={{ minWidth: 120 }}
          />

          <TextField
            label={`Required Thickness, tᵣ (${unitLabel})`}
            value={pipe.tRequired.toFixed(2)}
            size="small"
            disabled
            sx={{ minWidth: 120 }}
          />
        </Box>

        <Typography sx={{ mb: 2 }}>
          <strong>Result:</strong>{" "}
          {displayedThickness >= pipe.tRequired ? (
            <span style={{ color: "green", fontWeight: "bold" }}>
              ACCEPTABLE
            </span>
          ) : (
            <span style={{ color: "red", fontWeight: "bold" }}>
              NOT ACCEPTABLE
            </span>
          )}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            startIcon={<RemoveCircleOutlineIcon />}
            variant="outlined"
            color="error"
            size="small"
            onClick={() => removePipe(pipe.id)}
          >
            Remove Pipe
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
