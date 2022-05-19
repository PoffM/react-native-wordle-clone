import { clamp, fromPairs, keys, toPairs } from "lodash";
import { IColorHues } from "native-base/lib/typescript/theme/base/colors";

/**
 * Shifts the values in a shaded color palette.
 * e.g. calling shadeColor(gray, 2) returns a darkened palette.
 * e.g. calling shadeColor(gray, -2) returns a lightened palette.
 */
export function shadeColor(
  color: IColorHues,
  skewVal: number
): IColorHues {
  const pairs = toPairs(color);

  const newPairs = keys(color).map((key, index) => [
    key,
    pairs[clamp(index + skewVal, 0, pairs.length - 1)]?.[1],
  ]);

  return fromPairs(newPairs) as IColorHues;
}
