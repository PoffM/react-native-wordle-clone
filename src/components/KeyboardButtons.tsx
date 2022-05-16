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
  onLetterClick?: (charCode: number) => void;
  onEnterClick?: () => void;
  onBackspaceClick?: () => void;
  submittedGuesses: string[];
  solution: string;
}

export function KeyboardButtons({
  onLetterClick,
  onEnterClick,
  onBackspaceClick,
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
      onClick: onLetterClick,
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
            onClick={onEnterClick}
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
            onClick={onBackspaceClick}
          >
            BACK
          </KeyButton>
        </HStack>
      </VStack>
  );
}

interface LetterButtonProps {
  letter: string;
  onClick?: (charCode: number) => void;
  colorScheme: string;
  color?: string;
}

/** A letter button on the clickable keyboard. */
function LetterButton({
  letter,
  onClick,
  colorScheme,
  color,
}: LetterButtonProps) {
  return (
    <KeyButton
      flex={1}
      onClick={() => onClick?.(letter.charCodeAt(0))}
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
        props.onClick?.(e);
        // eslint-disable-next-line
        (e.target as any)?.blur();
      }}
    />
  );
}
