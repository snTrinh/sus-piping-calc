"use client";

import React from "react";
import { Box, Button, Card, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PipeCard from "../PipeCard";
import FormulaDisplay from "../FormulaDisplay";
import PdfExport from "../pdfExport/SinglePressure/PdfExport";
import DesignParameters from "./DesignParameters";
import GlobalDesignParameters from "./GlobalDesignParameters";
import { removePipeMultiple, updatePipeField } from "@/state/multipleSlice";
import { RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";

const MultiplePressuresTabContent: React.FC = () => {
  const dispatch = useDispatch();

  const pipes = useSelector((state: RootState) => state.multiple.pipes);
  const handleRemovePipe = (id: string) => {
    dispatch(removePipeMultiple(id));
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
              onClick={() =>{}}
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

      {pipes.map((pipeState) => (
        <Box
          key={pipeState.pipe.id}
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
                height: 305,
                border: "1px solid #ddd",
              }}
              elevation={0}
            >
              <DesignParameters pipeId={pipeState.pipe.id} />
            </Card>

            <PipeCard
              pipe={pipeState.pipe}
              updatePipe={(id, key, value) =>
                dispatch(updatePipeField({ pipeId: id, key, value }))
              }
              removePipe={() => handleRemovePipe(pipeState.pipe.id)}
            />
          </Box>
        </Box>
      ))}

      <Box sx={{ mt: 6 }}>
        <PdfExport pipes={pipes.map((p) => p.pipe)} />
      </Box>
    </>
  );
};

export default MultiplePressuresTabContent;
