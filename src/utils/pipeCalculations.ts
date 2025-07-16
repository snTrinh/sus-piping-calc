// src/utils/pipeCalculations.ts

/**
 * Interface for the parameters required to calculate pipe wall thickness.
 * All units are expected to be in a consistent system (Imperial: psi, inches).
 */
export interface TRequiredParams {
    pressure: number; // Design Pressure (P) in psi
    outerDiameterInches: number; // Outer Diameter (D) in inches
    allowableStress: number | null; // Allowable Stress (S) in psi
    e: number; // Quality Factor (E)
    w: number; // Weld Joint Strength Reduction Factor (W)
    gamma: number; // Temperature Coefficient (Y)
    corrosionAllowanceInches: number; // Corrosion Allowance (c) in inches
    millTol: number; // Mill Tolerance (e.g., 0.125 for 12.5%)
  }
  
  /**
   * Calculates the required minimum wall thickness for a pipe based on ASME B31.3, eq. 304.1.2.
   * tm = (t + c) / (1 - millTol)
   * where t = (P * D) / (2 * (S*E*W + P*Y))
   *
   * @param params - An object containing all necessary design parameters.
   * @returns The calculated required thickness (tm) in inches.
   */
  export const calculateTRequired = ({
    pressure,
    outerDiameterInches,
    allowableStress,
    e,
    w,
    gamma,
    corrosionAllowanceInches,
    millTol,
  }: TRequiredParams): number => {
    // Use a safe value for allowableStress if it's null
    const S = allowableStress ?? 0;
  
    const numerator = pressure * outerDiameterInches;
    const denominator = 2 * (S * e * w + pressure * gamma);
  
    // Avoid division by zero
    if (denominator === 0) {
      return 0;
    }
  
    // Per B31.3, this is the pressure design thickness, 't'
    const pressureDesignThickness = numerator / denominator;
  
    // Per B31.3, this is the required thickness 'tm', including allowances
    const requiredThickness =
      (pressureDesignThickness + corrosionAllowanceInches) / (1 - millTol);
  
    return requiredThickness;
  };