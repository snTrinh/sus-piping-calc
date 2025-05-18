import React from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";

import CheckIcon from "@mui/icons-material/Check";
type Pipe = {
  id: string;
  nps: string;
  schedule: string;
  tRequired: number; // Already converted to display units by parent
};

type PipeCardProps = {
  pipe: Pipe;
  thicknessByNpsSchedule: any;
  updatePipe: (id: string, key: keyof Pipe, value: any) => void;
  removePipe: (id: string) => void;
  units: "imperial" | "metric";
};

const npsOptions = ["0.5", "1", "2", "4", "6", "8", "10", "12"];
const scheduleOptions = ["5", "10", "40", "80"];

export default function PipeCard({
  pipe,
  thicknessByNpsSchedule,
  updatePipe,
  removePipe,
  units,
}: PipeCardProps) {
  const rawThickness = thicknessByNpsSchedule[pipe.nps]?.[pipe.schedule] ?? 0;

  const displayedThickness =
    units === "imperial" ? rawThickness : rawThickness * 25.4;
  const thicknessLabel =
    units === "imperial"
      ? "Provided Thickness (in)"
      : "Provided Thickness (mm)";
  const tRequiredLabel =
    units === "imperial"
      ? "Required Thickness (in)"
      : "Required Thickness (mm)";

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
            {npsOptions.map((nps) => (
              <MenuItem key={nps} value={nps}>
                {nps}
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
            label={thicknessLabel}
            value={displayedThickness.toFixed(units === "imperial" ? 3 : 2)}
            size="small"
            disabled
            sx={{ minWidth: 180 }}
          />

          <TextField
            label={tRequiredLabel}
            value={pipe.tRequired.toFixed(units === "imperial" ? 3 : 2)}
            size="small"
            disabled
            sx={{ minWidth: 180 }}
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
            variant="outlined"
            color="error"
            size="small"
            onClick={() => removePipe(pipe.id)}
          >
            Remove Pipe
          </Button>
          <IconButton onClick={() => removePipe(pipe.id)} color="error">
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
