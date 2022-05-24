import { flatMap } from "lodash";
import { observer } from "mobx-react-lite";
import { Box, Button, HStack, useColorModeValue, VStack } from "native-base";
import { ComponentProps, memo, useCallback } from "react";

export interface KeyboardButtonsProps {
  onLetterPress?: (charCode: number) => void;
  onEnterPress?: () => void;
  onBackspacePress?: () => void;
  submittedGuesses: () => string[];
  solution: () => string;
}

export const KeyboardButtons = observer(function KeyboardButtons({
  onLetterPress,
  onEnterPress,
  onBackspacePress,
  submittedGuesses,
  solution,
}: KeyboardButtonsProps) {
  const unusedLetterTextColor = useColorModeValue("black", "gray.50") as string;
  const usedLetterTextColor = "gray.50";

  const space = 1.5;

  const hStackProps = {
    space,
    width: "100%",
    flex: 1,
  };

  const submittedLetters = flatMap(
    submittedGuesses()
      .map((guess) => guess.split(""))
      .map((letters) => letters.map((letter, index) => ({ letter, index })))
  );

  const submittedLettersSet = new Set(submittedLetters.map((it) => it.letter));

  const correctLetters = new Set(
    submittedLetters
      .filter(({ letter, index }) => solution()[index] === letter)
      .map((it) => it.letter)
  );

  const misplacedLetters = new Set(
    submittedLetters
      .filter(
        ({ letter }) =>
          solution().includes(letter) && !correctLetters.has(letter)
      )
      .map((it) => it.letter)
  );

  function letterButtonProps(letter: string): LetterButtonProps {
    const colorScheme = correctLetters.has(letter)
      ? "correct"
      : misplacedLetters.has(letter)
      ? "misplaced"
      : submittedLettersSet.has(letter)
      ? "usedLetter"
      : "unusedLetter";

    return {
      letter,
      onPress: onLetterPress,
      colorScheme,
      color:
        colorScheme === "unusedLetter"
          ? unusedLetterTextColor
          : usedLetterTextColor,
    };
  }

  return (
    <VStack h="100%" space={space}>
      <HStack {...hStackProps}>
        {"QWERTYUIOP".split("").map((letter) => (
          <LetterButton {...letterButtonProps(letter)} key={letter} />
        ))}
      </HStack>
      <HStack {...hStackProps}>
        <Box flex={0.5} />
        {"ASDFGHJKL".split("").map((letter) => (
          <LetterButton {...letterButtonProps(letter)} key={letter} />
        ))}
        <Box flex={0.5} />
      </HStack>
      <HStack {...hStackProps}>
        <KeyButton
          flex={1.65}
          colorScheme="unusedLetter"
          color={unusedLetterTextColor}
          onPress={onEnterPress}
        >
          ENTER
        </KeyButton>
        {"ZXCVBNM".split("").map((letter) => (
          <LetterButton {...letterButtonProps(letter)} key={letter} />
        ))}
        <KeyButton
          flex={1.65}
          colorScheme="unusedLetter"
          color={unusedLetterTextColor}
          onPress={onBackspacePress}
        >
          BACK
        </KeyButton>
      </HStack>
    </VStack>
  );
});

interface LetterButtonProps {
  letter: string;
  onPress?: (charCode: number) => void;
  colorScheme: string;
  color?: string;
}

/** A letter button on the UI keyboard. */
function LetterButton({
  letter,
  onPress: onPressProp,
  colorScheme,
  color,
}: LetterButtonProps) {
  const onPress = useCallback(
    () => onPressProp?.(letter.charCodeAt(0)),
    [onPressProp, letter]
  );

  return (
    <KeyButton
      flex={1}
      colorScheme={colorScheme}
      onPress={onPress}
      color={color}
    >
      {letter}
    </KeyButton>
  );
}

/** A button on the UI keyboard. */
const KeyButton = memo(function KeyButton(
  props: ComponentProps<typeof Button>
) {
  // Override the button colorSchemes because native-base's defaults may be too light or dark depending on the color mode:
  type ColorScheme = [string, string, string];
  const colorSchemes: Record<string, ColorScheme> = {
    correct: ["correct.500", "correct.600", "correct.700"],
    misplaced: useColorModeValue(
      ["misplaced.400", "misplaced.500", "misplaced.600"],
      ["misplaced.500", "misplaced.600", "misplaced.700"]
    ) as ColorScheme,
    usedLetter: useColorModeValue(
      ["usedLetter.500", "usedLetter.600", "usedLetter.700"],
      ["usedLetter.700", "usedLetter.800", "usedLetter.900"]
    ) as ColorScheme,
    unusedLetter: useColorModeValue(
      ["unusedLetter.100", "unusedLetter.200", "unusedLetter.300"],
      ["unusedLetter.400", "unusedLetter.500", "unusedLetter.600"]
    ) as ColorScheme,
  };

  const [baseColor, hover, pressed] =
    colorSchemes[String(props.colorScheme)] ?? [];

  const btnText = String(props.children);

  return (
    <Button
      // testID for RTL selection. e.g. "button-A" or "button-ENTER":
      testID={`button-${btnText}`}
      height="100%"
      minW={0}
      p={0}
      _text={{
        color: props.color,
        fontSize: "md",
        fontWeight: "medium",
      }}
      {...props}
      bgColor={baseColor}
      _hover={{ bgColor: hover }}
      _pressed={{ bgColor: pressed }}
      onPress={(e) => {
        props.onPress?.(e);
        // eslint-disable-next-line
        (e?.target as any)?.blur?.();
      }}
    />
  );
});
