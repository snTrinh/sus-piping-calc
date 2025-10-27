

import { calculateTRequired, TRequiredParams } from "../pipeCalculations";


const originalWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn(); 
});

afterAll(() => {
  console.warn = originalWarn; 
});

describe('calculateTRequired', () => {

  test('should correctly calculate tRequired for valid inputs', () => {
    const params: TRequiredParams = {
      pressure: 1000,
      outerDiameterInches: 10,
      allowableStress: 20000,
      e: 1,
      w: 1,
      gamma: 0.4,
      corrosionAllowanceInches: 0.0625, 
      millTol: 0.125, 
    };

    const expected = 0.3515406; 

    const result = calculateTRequired(params);
    expect(result).toBeCloseTo(expected, 7); 
  });


  test('should return 0 when the denominator (2*(SEW + PY)) is zero', () => {
    const params: TRequiredParams = {
      pressure: 0,
      outerDiameterInches: 10,
      allowableStress: 0,
      e: 0,
      w: 0,
      gamma: 0,
      corrosionAllowanceInches: 0.0625,
      millTol: 0.125,
    };
    const result = calculateTRequired(params);
    expect(result).toBe(0);
    expect(console.warn).toHaveBeenCalledWith("Denominator is zero. Returning 0 for tRequired.");
  });


  test('should return 0 when (1 - millTol) is zero', () => {
    const params: TRequiredParams = {
      pressure: 100,
      outerDiameterInches: 10,
      allowableStress: 20000,
      e: 1,
      w: 1,
      gamma: 0.4,
      corrosionAllowanceInches: 0.0625,
      millTol: 1,
    };
    const result = calculateTRequired(params);
    expect(result).toBe(0);
    expect(console.warn).toHaveBeenCalledWith("Invalid millTol (1 - millTol <= 0). Returning 0 for tRequired.");
  });

  test('should return 0 when (1 - millTol) is negative', () => {
    const params: TRequiredParams = {
      pressure: 100,
      outerDiameterInches: 10,
      allowableStress: 20000,
      e: 1,
      w: 1,
      gamma: 0.4,
      corrosionAllowanceInches: 0.0625,
      millTol: 1.5, 
    };
    const result = calculateTRequired(params);
    expect(result).toBe(0);
    expect(console.warn).toHaveBeenCalledWith("Invalid millTol (1 - millTol <= 0). Returning 0 for tRequired.");
  });


  test('should calculate correctly when corrosionAllowanceInches is zero', () => {
    const params: TRequiredParams = {
      pressure: 1000,
      outerDiameterInches: 10,
      allowableStress: 20000,
      e: 1,
      w: 1,
      gamma: 0.4,
      corrosionAllowanceInches: 0,
      millTol: 0.125,
    };

    const expected = 0.280112; 

    const result = calculateTRequired(params);
    expect(result).toBeCloseTo(expected, 7); 
  });


  test('should treat null allowableStress as 0', () => {
    const params: TRequiredParams = {
      pressure: 1000,
      outerDiameterInches: 10,
      allowableStress: null, 
      e: 1,
      w: 1,
      gamma: 0.4,
      corrosionAllowanceInches: 0.0625,
      millTol: 0.125,
    };

    const expected = 14.3571428; 

    const result = calculateTRequired(params);
    expect(result).toBeCloseTo(expected, 5); 
  });


  test('should calculate correctly when E, W, Gamma are all 1', () => {
    const params: TRequiredParams = {
      pressure: 500,
      outerDiameterInches: 5,
      allowableStress: 10000,
      e: 1,
      w: 1,
      gamma: 1,
      corrosionAllowanceInches: 0.0,
      millTol: 0.0,
    };

    const expected = 0.1190476; 

    const result = calculateTRequired(params);
    expect(result).toBeCloseTo(expected, 7); 
  });


  test('should handle larger numbers correctly', () => {
    const params: TRequiredParams = {
      pressure: 5000,
      outerDiameterInches: 24,
      allowableStress: 30000,
      e: 0.9,
      w: 0.8,
      gamma: 0.5,
      corrosionAllowanceInches: 0.25,
      millTol: 0.1,
    };

    const expected = 3.0440295; 

    const result = calculateTRequired(params);
    expect(result).toBeCloseTo(expected, 7); 
  });
});
