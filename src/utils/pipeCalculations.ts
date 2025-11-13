export interface TRequiredParams {
  pressure: number;
  outerDiameter: number;
  allowableStress: number | null;
  e: number;
  w: number;
  gamma: number;
  corrosionAllowance: number;
  millTol: number;
}

export const calculateTRequired = ({
  pressure,
  outerDiameter,
  allowableStress,
  e,
  w,
  gamma,
  corrosionAllowance,
  millTol,
}: TRequiredParams): number => {
  if (1 - millTol <= 0) {
    return 0;
  }
  const S = allowableStress ?? 0;

  const numerator = pressure * outerDiameter;
  const denominator = 2 * (S * e * w + pressure * gamma);

  if (denominator === 0) {
    return 0;
  }

  const pressureDesignThickness = numerator / denominator;

  const requiredThickness =
    (pressureDesignThickness + corrosionAllowance) / (1 - millTol);
  return requiredThickness;
};
