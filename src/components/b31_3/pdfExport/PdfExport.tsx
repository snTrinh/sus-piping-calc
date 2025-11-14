"use client";
import { RootState } from "@/state/store";
import { Pipe } from "@/types/pipe";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { Box, Button, TextField, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import PdfPipeOutputs from "./PdfPipeOutputs";

type PdfExportProps = {
  pipes: Pipe[];
};

export default function PdfExport({ pipes }: PdfExportProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [drawingNumber, setDrawingNumber] = useState("0");
  const [drawingRevision, setDrawingRevision] = useState("0");
  const [calculationRevision, setCalculationRevision] = useState("0");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const theme = useTheme();

  const multiplePipes = useSelector((state: RootState) => state.multiple.pipes);
  const isMultiple = multiplePipes.length > 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html2pdfRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("html2pdf.js").then((mod) => {
        html2pdfRef.current = mod.default || mod;
      });
    }
  }, []);

  const handleDownloadPdf = () => {
    if (!printRef.current || !html2pdfRef.current) return;

    html2pdfRef
      .current()
      .set({
        margin: 1,
        filename: `Drawing-${drawingNumber || "N/A"}-Rev${
          drawingRevision || "0"
        }-${date}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {},
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(printRef.current)
      .save();
  };

  const drawingInfo = {
    drawingNumber,
    drawingRevision,
    calculationRevision,
    date,
  };

  const responsiveFlex = {
    xs: "1 1 100%",
    sm: "1 1 calc(50% - 8px)",
    md: "1 1 0%",
  };

  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid #ddd",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          label={`Drawing Number`}
          value={drawingNumber}
          onChange={(e) => setDrawingNumber(e.target.value)}
          size="small"
          sx={{ flex: responsiveFlex, minWidth: 180 }}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Drawing Revision Number"
          value={drawingRevision}
          onChange={(e) => setDrawingRevision(e.target.value)}
          size="small"
          sx={{ flex: responsiveFlex, minWidth: 180 }}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Calculation Revision Number"
          value={calculationRevision}
          onChange={(e) => setCalculationRevision(e.target.value)}
          size="small"
          sx={{ flex: responsiveFlex, minWidth: 180 }}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          size="small"
          sx={{ flex: responsiveFlex, minWidth: 180 }}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="outlined"
          startIcon={<ArrowCircleDownIcon />}
          onClick={handleDownloadPdf}
          sx={{ flex: responsiveFlex, minWidth: 180 }}
        >
          Download PDF
        </Button>
      </Box>

      {/* <PdfContent ref={printRef} drawingInfo={drawingInfo} pipes={pipes} /> */}

      <div
        ref={printRef}
        style={{
          padding: 10,
          maxWidth: 600,
          fontSize: 12,
          fontFamily:
            "'Calibri', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: theme.palette.text.primary,
        }}
      >
        <PdfPipeOutputs
          pipes={pipes}
          isMultiple={isMultiple}
          drawingInfo={drawingInfo}
        />
      </div>
    </Box>
  );
}
