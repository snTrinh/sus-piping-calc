
export enum Units {
  Imperial = "Imperial",
  Metric = "Metric",
}

export type DesignParams = {
  pressure: number;
  temperature: number;
  corrosionAllowance: number;
  allowableStress: number | null;
  e?: number;
  w?: number;
  gamma?: number;
  millTol?: number;
};
