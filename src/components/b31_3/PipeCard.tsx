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
  tRequired: number; // stored internally in inches
  t: number; // stored internally in inches (user provided thickness)
};

type PipeCardProps = {
  pipe: Pipe;
  updatePipe: (id: string, key: keyof Pipe, value: any) => void;
  removePipe: (id: string) => void;
  units: Units;
};

const scheduleOptions = ["5", "10", "40", "80"];

export default function PipeCard({
  pipe,
  updatePipe,
  removePipe,
  units,
}: PipeCardProps) {
  const rawThickness =
    pipeDimensions["Imperial"][pipe.nps]?.schedules[pipe.schedule] ?? 0;

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
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            mb: 2,
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

          <TextField
            label={`Outer Diameter, D (${unitLabel})`}
            value={outerDiameter.toFixed(2)}
            size="small"
            disabled
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
          />

          <TextField
            label={`Required Thickness, tᵣ (${unitLabel})`}
            value={displayedTRequired.toFixed(3)}
            size="small"
            disabled
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
          />

          <TextField
            label={`Schedule Thickness (${unitLabel})`}
            value={displayedScheduleThickness.toFixed(3)}
            size="small"
            disabled
            sx={{ minWidth: 120, flexGrow: 1, flexBasis: "120px" }}
          />

          <Button
            startIcon={<RemoveCircleOutlineIcon />}
            variant="outlined"
            color="error"
            size="small"
            onClick={() => removePipe(pipe.id)}
            sx={{
              whiteSpace: "nowrap",
              height: "40px",
              alignSelf: "center",
              flexShrink: 0,
              minWidth: 140,
            }}
          >
            Remove Pipe
          </Button>
        </Box>

        <Typography sx={{ mb: 2, textAlign: "right" }}>
          <strong>Result:</strong>{" "}
          {displayedScheduleThickness >= displayedTRequired ? (
            <span style={{ color: "green", fontWeight: "bold" }}>
              ACCEPTABLE
            </span>
          ) : (
            <span style={{ color: "red", fontWeight: "bold" }}>
              NOT ACCEPTABLE
            </span>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}
