import React, { forwardRef } from "react";
import { DesignParams} from "@/types/units";
import PdfDesignInputs, { DrawingInfo } from "./PdfDesignInputs";
import PdfPipeOutputs from "./PdfPipeOutputs";
import { useTheme } from "@mui/material/styles"; 
export type Pipe = {
  id: string; 
  nps: string;
  od: string;
  schedule: string;
  tRequired: number;
  t: number;
};

export type PdfContentProps = {
  drawingInfo: DrawingInfo;
  designParams: DesignParams;
  material: string;
  pipes: Pipe[]; 
};

const PdfContent = forwardRef<HTMLDivElement, PdfContentProps>(
  ({ drawingInfo, designParams, material, pipes }, ref) => {
    const theme = useTheme(); 

    return (
      <div
        ref={ref}
        style={{
          padding: 10,
          maxWidth: 600,
          fontSize: 14,
          fontFamily:
            "'Calibri', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: theme.palette.text.primary, 
        }}
      >
        <PdfDesignInputs
          drawingInfo={drawingInfo}
          designParams={designParams}
        />

        <PdfPipeOutputs
          pipes={pipes}
          designParams={designParams}
          material={material}
        />
      </div>
    );
  }
);

PdfContent.displayName = "PdfContent";
export default PdfContent;
