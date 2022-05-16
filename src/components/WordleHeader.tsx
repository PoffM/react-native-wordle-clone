import {
  Box,
  Flex,
  Heading,
  IconButton,
  MoonIcon,
  QuestionOutlineIcon,
  SunIcon,
  useColorMode,
} from "native-base";
import { useEffect, useState } from "react";
import { WordleInfoModal } from "./WordleInfoModal";

export function WordleHeader() {
  const [isOpen, setOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  // When the modal closes, blur the info button:
  useEffect(() => {
    // eslint-disable-next-line
    (document.activeElement as any)?.blur?.();
  }, [isOpen]);

  const helpLabel = "Help";
  const colorModeLabel = `Switch to ${
    colorMode === "dark" ? "Light" : "Dark"
  } mode.`;

  return (
    <Flex alignItems="center" h="3rem" borderBottomWidth="1px" px={3}>
      <Flex flex={1} align="center">
        <IconButton
          onPress={() => setOpen(true)}
          aria-label={helpLabel}
          title={helpLabel}
          icon={<QuestionOutlineIcon w={6} h={6} />}
        />
      </Flex>
      <Box>
        <Heading size="lg">React Wordle Clone</Heading>
      </Box>
      <Flex flex={1} justify="end">
        <IconButton
          onPress={toggleColorMode}
          aria-label={colorModeLabel}
          title={colorModeLabel}
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
        />
      </Flex>
      <WordleInfoModal isOpen={isOpen} onClose={() => setOpen(false)} />
    </Flex>
  );
}
