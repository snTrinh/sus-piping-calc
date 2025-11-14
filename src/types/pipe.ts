import { MaterialName } from "@/utils/materialsData";
import { PipeSchedule } from "@/utils/unitConversions";

export type Pipe = {
  id: string;
  nps: string;
  dn: string;
  od: number;
  schedule: PipeSchedule;
  tRequired: number;
  t: number;
  allowableStress: number;
};


export type PipeExt = Pipe & {
  pressure: number;
  temperature: number;
  material: MaterialName;
};