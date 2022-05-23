import {
  Box,
  NativeBaseProvider,
  NativeBaseProviderProps,
  useColorModeValue
} from "native-base";
import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { WordleScreen } from "./src/components/WordleScreen";
import { wordleTheme } from "./src/theme/theme";

/** Wrapper with all context providers. */
export function AppWrapper({
  children,
  nativeBaseProps,
}: PropsWithChildren<{ nativeBaseProps?: Partial<NativeBaseProviderProps> }>) {
  return (
    <NativeBaseProvider theme={wordleTheme} {...nativeBaseProps}>
      {children}
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
      <SafeAreaView style={{ height: "100%" }}>
        <BackgroundProvider>
          <WordleScreen />
        </BackgroundProvider>
      </SafeAreaView>
    </AppWrapper>
  );
}
