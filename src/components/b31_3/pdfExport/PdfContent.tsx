import React, { forwardRef } from "react";
import { DesignParameters, Units } from "@/types/units";
import PdfDesignInputs, { DrawingInfo } from "./PdfDesignInputs";
import PdfPipeOutputs from "./PdfPipeOutputs";

export type PdfContentProps = {
  drawingInfo: DrawingInfo;
  designParams: DesignParameters;
  material: string;
  pipes: {
    nps: string;
    od: string;
    schedule: string;
    tRequired: number;
    t: number;
  }[];
};

const PdfContent = forwardRef<HTMLDivElement, PdfContentProps>(
  (
    {
      drawingInfo,
      designParams,
      material,
      pipes,
    },
    ref
  ) => {

    return (
      <div
        ref={ref}
        style={{
          padding: 10,
          maxWidth: 600,
          fontSize: 14,
          fontFamily:
            "'Calibri', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#333",
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
