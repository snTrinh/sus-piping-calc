"use client";

import { Box, Card, CardContent, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import LabeledInput from "../common/LabeledInputConversion";
import { Units } from "@/types/units";
import { unitConversions } from "@/utils/unitConversions";

type InputValuesCardProps = {
  P: number;
  St: number;
  S: number;
  setP: (value: number) => void;
  setSt: (value: number) => void;
  setS: (value: number) => void;
  units: Units;
};

export default function InputValuesCard({
  P,
  St,
  S,
  setP,
  setSt,
  setS,
  units,
}: InputValuesCardProps) {
  const pressureUnit = unitConversions.pressure[units].unit;

  // Track previous units for comparison
  const prevUnits = useRef(units);

  // Handle unit change and convert values accordingly
  useEffect(() => {
    if (prevUnits.current !== units) {
      const prev = prevUnits.current;
      const convertFromPrev = unitConversions.pressure[prev].from;
      const convertToNew = unitConversions.pressure[units].to;

      const baseP = convertFromPrev(P); // Convert to base (psi)
      const baseSt = convertFromPrev(St);
      const baseS = convertFromPrev(S);

      // Convert from base to new unit
      setP(Number(convertToNew(baseP).toFixed(2)));
      setSt(Number(convertToNew(baseSt).toFixed(2)));
      setS(Number(convertToNew(baseS).toFixed(2)));

      prevUnits.current = units;
    }
  }, [units]);

  return (
    <Card sx={{ height: "100%", border: "1px solid #ddd" }} elevation={0}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Input Values
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <LabeledInput
              label="Internal Design Gauge Pressure"
              symbol="P"
              unit={pressureUnit}
              value={P}
              onChange={setP}
              step={0.01}
              fullWidth
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip
              title="See ASME B31.3 Table A-1 or A-1M at test temperature"
              arrow
            >
              <Box sx={{ width: "100%" }}>
                <LabeledInput
                  label="Allowable Stress at Test Temp for Pipe Material"
                  symbol="Sₜ"
                  unit={pressureUnit}
                  value={St}
                  onChange={setSt}
                  step={0.01}
                  fullWidth
                />
              </Box>
            </Tooltip>
          </Box>

          <Box>
            <Tooltip
              title="See ASME B31.3 Table A-1 or A-1M at design temperature"
              arrow
            >
              <Box sx={{ width: "100%" }}>
                <LabeledInput
                  label="Allowable Stress at Design Temp for Pipe Material"
                  symbol="S"
                  unit={pressureUnit}
                  value={S}
                  onChange={setS}
                  step={0.01}
                  fullWidth
                />
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
