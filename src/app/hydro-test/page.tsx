"use client";

import { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import InputValuesCard from "./../../components/hydro-test/InputValuesCard";
import CalculatedValueCard from "./../../components/hydro-test/CalculatedValuesCard";
import UnitsToggle from "@/components/common/UnitsToggle";

import { useAppSelector } from "@/state/store";


export default function HydroTestPage() {
   const units = useAppSelector((state) => state.single.currentUnit,);
  const [P, setP] = useState(250);
  const [St, setSt] = useState(132000);
  const [S, setS] = useState(300);

  const hydroTestPressure = (P: number, St: number, S: number) => {
    return (1.5 * P * St) / S;
  };

  const calculatedPressure = hydroTestPressure(P, St, S);


  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Container maxWidth="lg" disableGutters>
      <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
        Hydro Test Pressure
      </Typography>

      <UnitsToggle/>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "stretch",
          paddingTop: 4
        }}
      >
        <Box sx={{ flex: 1, minWidth: 450, height: 250 }}>
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

        <Box sx={{ flex: 1, minWidth: 450, height: 250 }}>
          <CalculatedValueCard
            Pt={calculatedPressure}
            P={P}
            St={St}
            S={S}
            units={units}
          />
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>{/* <PdfExport /> */}</Box>
      </Container>
    </Box>
  );
}
