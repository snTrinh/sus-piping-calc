"use client";
import { useRef, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { DesignParams } from "@/types/units"; 
import PdfContent from "./PdfContent";
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

type Pipe = {
  id: string;
  nps: string;
  od: string;
  schedule: string;
  tRequired: number;
  t: number;
};

type PdfExportProps = {
  material: string;
  designParams: DesignParams;
  pipes: Pipe[];
};

export default function PdfExport({
  material,
  pipes,
  designParams,
}: PdfExportProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const [drawingNumber, setDrawingNumber] = useState("");
  const [drawingRevision, setDrawingRevision] = useState("0");
  const [calculationRevision, setCalculationRevision] = useState("0");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const handleDownloadPdf = () => {
    if (!printRef.current) return;

    if (typeof window !== 'undefined' && (window as Window & typeof globalThis).html2pdf) {
      (window as Window & typeof globalThis).html2pdf()
        .set({
          margin: 1,
          filename: "document.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {},
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(printRef.current)
        .save();
    } else {
      console.error("html2pdf.js not loaded.");
    }
  };

  const drawingInfo = {
    drawingNumber,
    drawingRevision,
    calculationRevision,
    date,
  };


  const responsiveFlex = {
    xs: '1 1 100%', 
    sm: '1 1 calc(50% - 8px)', 
    md: '1 1 0%', 
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
          label="Drawing Number"
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
          startIcon={<ArrowCircleDownIcon/>}
          onClick={handleDownloadPdf}
          sx={{ flex: responsiveFlex, minWidth: 180 }} 
        >
          Download PDF
        </Button>
      </Box>

      <PdfContent
        ref={printRef}
        drawingInfo={drawingInfo}
        designParams={designParams}
        material={material}
        pipes={pipes}
      />
    </Box>
  );
}