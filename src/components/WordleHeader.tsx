import {
  Box,
  Heading,
  IconButton,
  MoonIcon,
  QuestionOutlineIcon,
  Row,
  SunIcon,
  useColorMode,
  useColorModeValue,
} from "native-base";
import { useEffect, useState } from "react";
import { WordleInfoModal } from "./WordleInfoModal";

const doc = typeof document === "object" ? document : null;

export function WordleHeader() {
  const [isOpen, setOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  const buttonColor = useColorModeValue("gray", "dark") as string;

  // When the modal closes, blur the info button:
  useEffect(() => {
    // eslint-disable-next-line
    (doc?.activeElement as any)?.blur?.();
  }, [isOpen]);

  const helpLabel = "Help";
  const colorModeLabel = `Switch to ${
    colorMode === "dark" ? "Light" : "Dark"
  } mode.`;

  return (
    <Row alignItems="center" h={12} borderBottomWidth="1px" px={3}>
      <Row flex={1} alignItems="center">
        <IconButton
          variant="subtle"
          colorScheme={buttonColor}
          onPress={() => setOpen(true)}
          accessibilityLabel={helpLabel}
          title={helpLabel}
          icon={<QuestionOutlineIcon w={6} h={6} />}
        />
      </Row>
      <Box>
        <Heading size="lg">React Native Wordle</Heading>
      </Box>
      <Row flex={1} justifyContent="flex-end">
        <IconButton
          variant="subtle"
          colorScheme={buttonColor}
          onPress={toggleColorMode}
          aria-label={colorModeLabel}
          title={colorModeLabel}
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
        />
      </Row>
      <WordleInfoModal isOpen={isOpen} onClose={() => setOpen(false)} />
    </Row>
  );
}
