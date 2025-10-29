import { PipeSchedule } from "@/utils/unitConversions";

export type Pipe = {
  id: string;
  nps: string;
  od: string;
  schedule: PipeSchedule;
  tRequired: number;
  t: number;
  allowableStress: number;
  pressure?: number;
  temperature?: number;
};
