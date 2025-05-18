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
import { unitConversions } from "@/utils/unitConversions";

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
  units: Units;
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

  // Use centralized unit conversion
  const thicknessConversion = unitConversions.thickness[units];
  const displayedThickness = thicknessConversion.to(rawThickness);
  const unitLabel = thicknessConversion.unit;

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
            label={`Provided Thickness (${unitLabel})`}
            value={displayedThickness.toFixed(2)}
            size="small"
            disabled
            sx={{ minWidth: 120 }}
          />

          <TextField
            label={`Required Thickness tᵣ (${unitLabel})`}
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
