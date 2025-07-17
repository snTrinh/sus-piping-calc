// src/utils/pipeCalculations.ts

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
    console.log("--- calculateTRequired Inputs ---");
    console.log("pressure:", pressure);
    console.log("outerDiameterInches:", outerDiameterInches);
    console.log("allowableStress (S):", allowableStress);
    console.log("e (E):", e);
    console.log("w (W):", w);
    console.log("gamma (Y):", gamma);
    console.log("corrosionAllowanceInches (c):", corrosionAllowanceInches);
    console.log("millTol:", millTol);

    const S = allowableStress ?? 0;

    const numerator = pressure * outerDiameterInches;
    const denominator = 2 * (S * e * w + pressure * gamma);

    console.log("Numerator (P*D):", numerator);
    console.log("Denominator (2*(SEW + PY)):", denominator);

    if (denominator === 0) {
        console.warn("Denominator is zero. Returning 0 for tRequired.");
        return 0;
    }

    const pressureDesignThickness = numerator / denominator;
    console.log("Pressure Design Thickness (t):", pressureDesignThickness);

    if (1 - millTol <= 0) {
        console.warn("Invalid millTol (1 - millTol <= 0). Returning 0 for tRequired.");
        return 0; // Prevent division by zero or negative thickness
    }

    const requiredThickness =
        (pressureDesignThickness + corrosionAllowanceInches) / (1 - millTol);

    console.log("Calculated tRequired:", requiredThickness);
    console.log("-------------------------------");

    return requiredThickness;
};