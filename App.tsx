import {
  Box,
  NativeBaseProvider,
  NativeBaseProviderProps,
  useColorModeValue,
} from "native-base";
import { PropsWithChildren } from "react";
import { WordleScreen } from "./src/components/WordleScreen";
import { WordleThemeProvider } from "./src/theme/WordleThemeProvider";

/** Wrapper with all context providers. */
export function AppWrapper({
  children,
  nativeBaseProps,
}: PropsWithChildren<{ nativeBaseProps?: Partial<NativeBaseProviderProps> }>) {
  return (
    <NativeBaseProvider {...nativeBaseProps}>
      <WordleThemeProvider nativeBaseProps={nativeBaseProps}>
        {children}
      </WordleThemeProvider>
    </NativeBaseProvider>
  );
}

function BackgroundProvider({ children }: PropsWithChildren<{}>) {
  const bg = useColorModeValue("white", "gray.900");
  return (
    <Box size="full" bg={bg}>
      {children}
    </Box>
  );
}

export default function App() {
  return (
    <AppWrapper>
      <BackgroundProvider>
        <WordleScreen />
      </BackgroundProvider>
    </AppWrapper>
  );
}
