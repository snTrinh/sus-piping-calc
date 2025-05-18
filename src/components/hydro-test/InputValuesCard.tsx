"use client";

import {
  Box,
  Card,
  CardContent,
  Tooltip,
  Typography,
  TextField,
} from "@mui/material";

type InputValuesCardProps = {
  P: number;
  St: number;
  S: number;
  setP: (value: number) => void;
  setSt: (value: number) => void;
  setS: (value: number) => void;
};

export default function InputValuesCard({
  P,
  St,
  S,
  setP,
  setSt,
  setS,
}: InputValuesCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Input Values
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Internal Design Gauge Pressure, P"
              type="number"
              fullWidth
              value={P}
              onChange={(e) => setP(Number(e.target.value))}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip title="See ASME B31.3 Table A-1 or A-1M at test temperature">
              <TextField
                label="Allowable Stress at Test Temp for Pipe Material, Sₜ"
                type="number"
                fullWidth
                value={St}
                onChange={(e) => setSt(Number(e.target.value))}
              />
            </Tooltip>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip title="See ASME B31.3 Table A-1 or A-1M at design temperature">
              <TextField
                label="Allowable Stress at Design Temp for Pipe Material, S"
                type="number"
                fullWidth
                value={S}
                onChange={(e) => setS(Number(e.target.value))}
              />
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
