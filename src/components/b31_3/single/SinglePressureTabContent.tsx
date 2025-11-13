"use client";

import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Card, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { PipeSchedule } from "@/utils/unitConversions";
import PipeCard from "../PipeCard";
import FormulaDisplay from "../FormulaDisplay";
import PdfExport from "../pdfExport/SinglePressure/PdfExport";
import DesignParameters from "./DesignParameters";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import {
  addPipeSingle,
  removePipe,
  updatePipeSingleField,
} from "@/state/singleSlice";
import { Pipe } from "@/types/pipe";

const SinglePressureTabContent: React.FC = ({}) => {
  const dispatch = useDispatch();
  const { pipes, currentUnit, pressure, temperature, global } = useSelector(
    (state: RootState) => ({
      pipes: state.single.pipes,
      currentUnit: state.single.currentUnit, // from unit slice
      pressure: state.single.pressure,
      temperature: state.single.temperature,
      global: state.single.global,
    })
  );

  const hasInitialized = React.useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && pipes.length === 0) {
      dispatch(
        addPipeSingle({
          id: uuidv4(),
          nps: "4",
          schedule: "40" as PipeSchedule,
        })
      );
      hasInitialized.current = true;
    }
  }, [dispatch, pipes.length, currentUnit]);

  const handleAddPipe = () => {
    dispatch(
      addPipeSingle({
        id: uuidv4(),
        nps: "2",
        schedule: "40" as PipeSchedule,
      })
    );
  };

  const handleRemovePipe = (id: string) => {
    dispatch(removePipe(id));
  };

  const handleUpdatePipe = (
    id: string,
    key: keyof Pipe,
    value: string | number
  ) => {
    dispatch(updatePipeSingleField({ pipeId: id, key, value }));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "stretch",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <Card
          sx={{
            flex: 1,
            minWidth: 450,
            display: "flex",
            flexDirection: "column",
            p: 2,
            gap: 2,
            height: 305,
            border: "1px solid #ddd",
          }}
          elevation={0}
        >
          <DesignParameters />

          <Box sx={{ width: "100%", paddingTop: 1.5 }}>
            <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="outlined"
              onClick={handleAddPipe}
              fullWidth
            >
              Add Pipe
            </Button>
          </Box>
        </Card>

        <Card
          sx={{
            flex: 1,
            maxWidth: { md: 650 },
            display: "flex",
            flexDirection: "column",
            p: 2,
            gap: 2,
            height: 305,
            border: "1px solid #ddd",
          }}
          elevation={0}
        >
          <Typography variant="h6" gutterBottom>
            Formula
          </Typography>
          <FormulaDisplay />
        </Card>
      </Box>

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        {pipes.map((pipe) => {
          const pipeDesignParams = {
            pressure,
            temperature,
            allowableStress: pipe.allowableStress, // pipe-specific
            corrosionAllowance: global.corrosionAllowance,
            gamma: global.gamma,
            millTol: global.millTol,
            e: global.e,
            w: global.w,
          };

          return (
            <PipeCard
              key={pipe.id}
              pipe={pipe}
              updatePipe={handleUpdatePipe}
              removePipe={handleRemovePipe}
              designParams={pipeDesignParams}
            />
          );
        })}
      </Box>

      <Box sx={{ mt: 4 }}>
        <PdfExport pipes={pipes} />
      </Box>
    </>
  );
};

export default SinglePressureTabContent;
