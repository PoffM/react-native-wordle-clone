import { NativeBaseProvider, useColorMode } from "native-base";
import { PropsWithChildren, useMemo } from "react";
import { wordleTheme } from "./theme";

export function WordleThemeProvider({ children }: PropsWithChildren<unknown>) {
  const { colorMode, setColorMode } = useColorMode();

  // Only recreate the theme on color mode change:
  const theme = useMemo(() => wordleTheme(colorMode), [colorMode]);

  return (
    <NativeBaseProvider
      theme={theme}
      // Use a single color mode from the parent NativeBaseProvider:
      colorModeManager={{
        get: async () => colorMode ?? "light",
        set: setColorMode,
      }}
    >
      {children}
    </NativeBaseProvider>
  );
}
