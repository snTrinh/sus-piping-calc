"use client";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPipe,
  removePipe,
  selectMultiplePipes,
  updatePipeField,
} from "@/state/multipleSlice";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Card, Typography } from "@mui/material";

import FormulaDisplay from "../FormulaDisplay";
import PipeCard from "../PipeCard";
import DesignParameters from "./DesignParameters";
import GlobalDesignParameters from "./GlobalDesignParameters";
import { useAppSelector } from "@/state/store";

const MultiplePressuresTabContent: React.FC = () => {
  const dispatch = useDispatch();
  const units = useAppSelector((state) => state.multiple.currentUnit);
  const pipes = useSelector(selectMultiplePipes);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && pipes.length === 0) {
      dispatch(addPipe());
      initialized.current = true;
    }
  }, [dispatch, pipes.length]);

  const handleRemovePipe = (id: string) => {
    dispatch(removePipe(id));
  };

  const handleUpdatePipe = <K extends keyof typeof pipes[0]>(
    pipeId: string,
    key: K,
    value: typeof pipes[0][K] | undefined
  ) => {
    if (value === undefined) return; 
    dispatch(updatePipeField({ pipeId, key, value }));
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
          <GlobalDesignParameters />
          <Box sx={{ mt: "auto", width: "100%" }}>
            <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="outlined"
              fullWidth
              onClick={() => dispatch(addPipe())}
            >
              Add Design Condition
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

      {pipes.map((pipe) => (
        <Box
          key={pipe.id}
          sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              alignItems: "stretch",
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
                height: 338,
                border: "1px solid #ddd",
              }}
              elevation={0}
            >
              <DesignParameters pipeId={pipe.id} />
            </Card>

            <PipeCard
              pipe={pipe}
              units={units}
              updatePipe={handleUpdatePipe}
              removePipe={() => handleRemovePipe(pipe.id)}
            />
          </Box>
        </Box>
      ))}

      {/* <Box sx={{ mt: 6 }}>
        <PdfExport pipes={pipes} />
      </Box> */}
    </>
  );
};

export default MultiplePressuresTabContent;
