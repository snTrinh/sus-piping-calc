

export interface TRequiredParams {
    pressure: number; 
    outerDiameterInches: number; 
    allowableStress: number | null; 
    e: number;
    w: number;
    gamma: number; 
    corrosionAllowanceInches: number; 
    millTol: number;
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
        return 0; 
    }

    const requiredThickness =
        (pressureDesignThickness + corrosionAllowanceInches) / (1 - millTol);

    console.log("Calculated tRequired:", requiredThickness);
    console.log("-------------------------------");

    return requiredThickness;
};