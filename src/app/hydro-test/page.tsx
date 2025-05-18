"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import InputValuesCard from "./../../components/hydro-test/InputValuesCard";
import CalculatedValueCard from "./../../components/hydro-test/CalculatedValuesCard";
import UnitsToggle from "@/components/common/UnitsToggle";

export default function HydroTestPage() {
  const [units, setUnits] = useState<"imperial" | "metric">("imperial");

  const [P, setP] = useState(250);
  const [St, setSt] = useState(132000);
  const [S, setS] = useState(300);

  const hydroTestPressure = (P: number, St: number, S: number) => {
    return (1.5 * P * St) / S;
  };

  const calculatedPressure = hydroTestPressure(P, St, S);

  // Unit toggle and conversions
  const handleUnitsChange = (
    event: React.MouseEvent<HTMLElement>,
    newUnits: "imperial" | "metric" | null
  ) => {
    if (!newUnits || newUnits === units) return;

    setUnits(newUnits);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "white",
        p: 4,
        maxWidth: 1200,
      }}
    >
      <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
        Hydro Test Pressure
      </Typography>
      <UnitsToggle units={units} onChange={handleUnitsChange} />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "stretch",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 450, height: 300 }}>
          <InputValuesCard
            P={P}
            St={St}
            S={S}
            setP={setP}
            setSt={setSt}
            setS={setS}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 450, height: 300 }}>
          <CalculatedValueCard Pt={calculatedPressure} P={P} St={St} S={S} />
        </Box>
      </Box>
    </Box>
  );
}
