// types/units.ts
export enum Units {
  Imperial = "Imperial",
  Metric = "Metric",
}

export type DesignParameters = {
  units: Units;
  pressure: number;
  temperature: number;
  corrosionAllowance: number;
  allowableStress: number;
  e?: number;
  w?: number;
  gamma?: number;
  millTol?: number;
};
