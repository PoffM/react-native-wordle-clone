import {
  Box,
  Button,
  Factory,
  HStack,
  useColorModeValue,
  VStack,
} from "native-base";
import { flatMap } from "lodash";
import { ComponentProps } from "react";

export interface KeyboardButtonsProps {
  onLetterPress?: (charCode: number) => void;
  onEnterPress?: () => void;
  onBackspacePress?: () => void;
  submittedGuesses: string[];
  solution: string;
}

export function KeyboardButtons({
  onLetterPress,
  onEnterPress,
  onBackspacePress,
  submittedGuesses,
  solution,
}: KeyboardButtonsProps) {
  const space = 1.5;

  const hStackProps = {
    space,
    width: "100%",
    flex: 1,
  };

  const submittedLetters = flatMap(
    submittedGuesses
      .map((guess) => guess.split(""))
      .map((letters) => letters.map((letter, index) => ({ letter, index })))
  );

  const submittedLettersSet = new Set(submittedLetters.map((it) => it.letter));

  const correctLetters = new Set(
    submittedLetters
      .filter(({ letter, index }) => solution[index] === letter)
      .map((it) => it.letter)
  );

  const misplacedLetters = new Set(
    submittedLetters
      .filter(
        ({ letter }) => solution.includes(letter) && !correctLetters.has(letter)
      )
      .map((it) => it.letter)
  );

  const unusedLetterTextColor = useColorModeValue(
    "blackAlpha.900",
    "whiteAlpha.900"
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
      color: colorScheme === "unusedLetter" ? unusedLetterTextColor : undefined,
    };
  }

  return (
      <VStack h="100%" space={space} padding={space}>
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
}

interface LetterButtonProps {
  letter: string;
  onPress?: (charCode: number) => void;
  colorScheme: string;
  color?: string;
}

/** A letter button on the clickable keyboard. */
function LetterButton({
  letter,
  onPress,
  colorScheme,
  color,
}: LetterButtonProps) {
  return (
    <KeyButton
      flex={1}
      onPress={() => onPress?.(letter.charCodeAt(0))}
      colorScheme={colorScheme}
      color={color}
    >
      {letter}
    </KeyButton>
  );
}

/** A button on the clickable keyboard. */
function KeyButton(props: ComponentProps<typeof Button>) {
  return (
    <Button
      height="100%"
      minW={0}
      p={0}
      data-color-scheme={props.colorScheme}
      {...props}
      onPress={(e) => {
        props.onPress?.(e);
        // eslint-disable-next-line
        (e.target as any)?.blur();
      }}
    />
  );
}
