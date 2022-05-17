import { NativeBaseProvider } from "native-base";
import { PropsWithChildren } from "react";
import { WordleScreen } from "./src/components/WordleScreen";
import { WordleThemeProvider } from "./src/theme/WordleThemeProvider";

/** Wrapper with all context providers. */
export function AppWrapper({ children }: PropsWithChildren<unknown>) {
  return (
    <NativeBaseProvider>
      <WordleThemeProvider>{children}</WordleThemeProvider>
    </NativeBaseProvider>
  );
}

export default function App() {
  return (
    <AppWrapper>
      <WordleScreen />
    </AppWrapper>
  );
}
