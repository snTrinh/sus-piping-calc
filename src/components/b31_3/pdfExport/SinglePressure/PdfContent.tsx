"use client";
import React, { forwardRef } from "react";
import { useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import PdfDesignInputs, { DrawingInfo } from "./PdfDesignInputs";
import PdfPipeOutputs from "./PdfPipeOutputs";
import { Pipe } from "@/types/pipe";

export type PdfContentProps = {
  drawingInfo: DrawingInfo;
  pipes: Pipe[];
  isMultiple?: boolean;
};

const PdfContent = forwardRef<HTMLDivElement, PdfContentProps>(
  ({ drawingInfo, pipes, isMultiple = false }, ref) => {
    const theme = useTheme();
    const globalDesign = useSelector((state: RootState) => state.single.global);
    const pressure = useSelector((state: RootState) => state.single.pressure);
    const temperature = useSelector((state: RootState) => state.single.temperature);
    const pipeList = isMultiple ? pipes : [pipes[0]].filter(Boolean);

    return (
      <div
        ref={ref}
        style={{
          padding: 10,
          maxWidth: 600,
          fontSize: 12,
          fontFamily:
            "'Calibri', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: theme.palette.text.primary,
        }}
      >
        {pipeList.map((pipe, index) => {
          const designParams = {
            pressure: pressure ?? 0,
            temperature: temperature ?? 0,
            allowableStress: pipe.allowableStress , 
            corrosionAllowance: globalDesign.corrosionAllowance,
            gamma: globalDesign.gamma,
            e: globalDesign.e,
            w: globalDesign.w,
            millTol: globalDesign.millTol,
          };

          return (
            <PdfDesignInputs
              key={pipe.id}
              drawingInfo={{
                ...drawingInfo,
                calculationRevision:
                  drawingInfo.calculationRevision +
                  (isMultiple ? `.${index + 1}` : ""),
              }}
              designParamsMultiple={isMultiple ? [designParams] : undefined}
              designParamsSingle={!isMultiple ? designParams : undefined}
              isMultiple={isMultiple}
            />
          );
        })}

        <PdfPipeOutputs pipes={pipes} isMultiple={isMultiple} />
      </div>
    );
  }
);

PdfContent.displayName = "PdfContent";
export default PdfContent;
