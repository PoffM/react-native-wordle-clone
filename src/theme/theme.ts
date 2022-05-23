import { extendTheme, Theme, themeTools } from "native-base";

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

const overrides: Theme | Record<string, object> = {
  config: {
    useSystemColorMode: true,
  },
  components: {
    Box: {
      baseStyle: (props: unknown) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        borderColor: themeTools.mode("gray.200", "gray.700")(props),
      }),
    },
  },
  // Color palettes generated with https://smart-swatch.netlify.app .
  colors: {
    gray,
    // Correct green:
    correct: {
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

    // Misplaced yellow:
    misplaced: {
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
    // Mid-Gray for unused letters:
    unusedLetter: gray,
    // Dark gray for used letters:
    usedLetter: {
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
    },
  },
};

export const wordleTheme = extendTheme(overrides);
