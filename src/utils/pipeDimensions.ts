import { Units } from "@/types/units";


// Define or import the PipeData type
interface PipeData {
  [unit: string]: {
    columns: { NPS: string | number; OD: number }[];
    schedules: { [schedule: string]: (number | null)[] };
  };
}

export function getPipeDimensions(
    data: PipeData,
    unit: Units,
    nps: number | string,
    schedule: string
  ) {
    const unitData = data[unit];
  
    // Find index of NPS in columns by converting both to string
    const index = unitData.columns.findIndex(
      (col: { NPS: string | number }) => String(col.NPS) === String(nps)
    );
    if (index === -1) throw new Error("NPS not found");
  
    // Get OD
    const OD = unitData.columns[index].OD;
  
    // Get wall thickness for schedule at the same index
    const thicknessArr = unitData.schedules[schedule];
    if (!thicknessArr) throw new Error("Schedule not found");
  
    const thickness = thicknessArr[index];
    if (thickness === null || thickness === undefined)
      throw new Error("Thickness data not available for this NPS and schedule");
  
    return { OD, thickness };
  }
  