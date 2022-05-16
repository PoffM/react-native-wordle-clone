import { ColorMode, extendTheme, Theme } from "native-base";
import { shadeColor } from "./shade-color";

const gray = {
  50: "#f2f2f3",
  100: "#d8d8d8",
  200: "#bebebe",
  300: "#a3a3a3",
  400: "#898989",
  500: "#707070",
  600: "#575757",
  700: "#3e3e3e",
  800: "#252525",
  900: "#0c0c0d",
};

/** Overrides the default Chakra theme. */
export function wordleTheme(colorMode: ColorMode) {
  const overrides: Theme | (Record<string, any> & {}) = {
    // Color palettes generated with https://smart-swatch.netlify.app .
    colors: {
      // Override the default blueish gray with a more pure gray color:
      gray,

      // Correct green:
      correct: shadeColor(
        {
          50: "#e8f9e8",
          100: "#cce5cb",
          200: "#aed3ab",
          300: "#8fbf8b",
          400: "#70ad6b",
          500: "#579452",
          600: "#43733f",
          700: "#2e522b",
          800: "#1a3218",
          900: "#021200",
        },
        colorMode === "light" ? -1 : 0
      ),

      // Misplaced yellow:
      misplaced: shadeColor(
        {
          50: "#fcf6e1",
          100: "#ede5c0",
          200: "#e0d49c",
          300: "#d3c277",
          400: "#c7b152",
          500: "#ad9838",
          600: "#87762a",
          700: "#60541c",
          800: "#3a330e",
          900: "#151100",
        },
        colorMode === "light" ? -1 : 0
      ),
      // Mid-Gray for unused letters:
      unusedLetter: shadeColor(gray, colorMode === "light" ? -4 : -1),
      // Dark gray for used letters:
      usedLetter: shadeColor(gray, colorMode === "dark" ? 2 : 0),
    },
  };

  return extendTheme(overrides);
}
