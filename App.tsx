import { Flex, NativeBaseProvider } from "native-base";
import { PropsWithChildren } from "react";
import { WordleGame } from "./src/components/WordleGame";
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
      <Flex direction="row" h="100%" justify="center">
        <WordleGame />
      </Flex>
    </AppWrapper>
  );
}
