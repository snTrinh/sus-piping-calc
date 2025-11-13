import { E, GAMMA, MILL_TOL, W } from "@/constants/constants";
import { calculateTRequired, TRequiredParams } from "../pipeCalculations";

const originalWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
});

describe("calculateTRequired", () => {
  test("should correctly calculate tRequired for valid inputs", () => {
    const params: TRequiredParams = {
      pressure: 1000,
      outerDiameter: 10.75,
      allowableStress: 20000,
      e: E,
      w: W,
      gamma: GAMMA,
      corrosionAllowance: 0.0625,
      millTol: MILL_TOL,
    };

    const expected = 0.37255;

    const result = calculateTRequired(params);
    expect(result).toBeCloseTo(expected, 5);
  });

  test("should return 0 when the denominator (2*(SEW + PY)) is zero", () => {
    const params: TRequiredParams = {
      pressure: 0,
      outerDiameter: 10,
      allowableStress: 0,
      e: 0,
      w: 0,
      gamma: 0,
      corrosionAllowance: 0.0625,
      millTol: MILL_TOL,
    };
    const result = calculateTRequired(params);
    expect(result).toBe(0);
  });

  test("should return 0 when (1 - millTol) is zero", () => {
    const params: TRequiredParams = {
      pressure: 100,
      outerDiameter: 10,
      allowableStress: 20000,
      e: E,
      w: W,
      gamma: GAMMA,
      corrosionAllowance: 0.0625,
      millTol: 1,
    };
    const result = calculateTRequired(params);
    expect(result).toBe(0);
  });

  test("should return 0 when (1 - millTol) is negative", () => {
    const params: TRequiredParams = {
      pressure: 100,
      outerDiameter: 10,
      allowableStress: 20000,
      e: E,
      w: W,
      gamma: GAMMA,
      corrosionAllowance: 0.0625,
      millTol: 2,
    };
    const result = calculateTRequired(params);
    expect(result).toBe(0);
  });

  test("should calculate correctly when corrosionAllowanceInches is zero", () => {
    const params: TRequiredParams = {
      pressure: 1000,
      outerDiameter: 10.75,
      allowableStress: 20000,
      e: E,
      w: W,
      gamma: GAMMA,
      corrosionAllowance: 0,
      millTol: MILL_TOL,
    };

    const expected = 0.30112;

    const result = calculateTRequired(params);
    expect(result).toBeCloseTo(expected, 5);
  });

  test("should treat null allowableStress as 0", () => {
    const params: TRequiredParams = {
      pressure: 1000,
      outerDiameter: 10.75,
      allowableStress: null,
      e: E,
      w: W,
      gamma: GAMMA,
      corrosionAllowance: 0.0625,
      millTol: MILL_TOL,
    };

    const expected = 15.42857;

    const result = calculateTRequired(params);
    expect(result).toBeCloseTo(expected, 5);
  });


  test("should handle larger numbers correctly", () => {
    const params: TRequiredParams = {
      pressure: 5000,
      outerDiameter: 24,
      allowableStress: 30000,
      e: E,
      w: W,
      gamma: GAMMA,
      corrosionAllowance: 0.25,
      millTol: MILL_TOL,
    };

    const expected = 2.42857;

    const result = calculateTRequired(params);
    expect(result).toBeCloseTo(expected, 5);
  });

  test("should handle live test case", () => {
    const params: TRequiredParams = {
      pressure: 5110,
      outerDiameter: 508,
      allowableStress: 138000,
      e: E,
      w: W,
      gamma: GAMMA,
      corrosionAllowance: 1.6,
      millTol: MILL_TOL,
    };

    const expected = 12.42067;

    const result = calculateTRequired(params);
    expect(result).toBeCloseTo(expected, 5);
  });
});
