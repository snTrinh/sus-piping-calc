

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

    const S = allowableStress ?? 0;

    const numerator = pressure * outerDiameterInches;
    const denominator = 2 * (S * e * w + pressure * gamma);

    if (denominator === 0) {

        return 0;
    }

    const pressureDesignThickness = numerator / denominator;

    if (1 - millTol <= 0) {
        return 0; 
    }

    const requiredThickness =
        (pressureDesignThickness + corrosionAllowanceInches) / (1 - millTol);

    return requiredThickness;
};