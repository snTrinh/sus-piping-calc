"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import InputValuesCard from "./../../components/hydro-test/InputValuesCard";
import CalculatedValueCard from "./../../components/hydro-test/CalculatedValuesCard";
import UnitsToggle from "@/components/common/UnitsToggle";
import { Units } from "@/types/units";

export default function HydroTestPage() {
  const [units, setUnits] = useState<Units>(Units.Imperial);

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
    newUnits: Units
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
        // mx: "auto", // optional: centers the whole container
      }}
    >
      <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
        Hydro Test Pressure
      </Typography>

      <UnitsToggle units={units} onChange={handleUnitsChange} />

      {/* Two-column layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "stretch",
          mb: 4, // space before PDF export
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
            units={units}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 450, height: 300 }}>
          <CalculatedValueCard
            Pt={calculatedPressure}
            P={P}
            St={St}
            S={S}
            units={units}
          />
        </Box>
      </Box>

      {/* Full-width row for PDF Export */}
      <Box sx={{ width: "100%" }}>{/* <PdfExport /> */}</Box>
    </Box>
  );
}
