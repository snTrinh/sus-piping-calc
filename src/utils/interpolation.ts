// interpolationUtils.ts

/**
 * Performs linear interpolation between two points.
 * @param x The value for which to interpolate y.
 * @param x1 The x-coordinate of the first point.
 * @param y1 The y-coordinate of the first point.
 * @param x2 The x-coordinate of the second point.
 * @param y2 The y-coordinate of the second point.
 * @returns The interpolated y-value.
 */
export function linearInterpolation(x: number, x1: number, y1: number, x2: number, y2: number): number {
    if (x1 === x2) {
      return y1; // Avoid division by zero if points are at the same x-coordinate
    }
    return y1 + (x - x1) * ((y2 - y1) / (x2 - x1));
  }