import { flatMap } from "lodash";
import { Box, Button, HStack, useColorModeValue, VStack } from "native-base";
import { ComponentProps, memo, useCallback } from "react";

export interface KeyboardButtonsProps {
  onLetterPress?: (charCode: number) => void;
  onEnterPress?: () => void;
  onBackspacePress?: () => void;
  submittedGuesses: string[];
  solution: string;
}

export const KeyboardButtons = memo(
  ({
    onLetterPress,
    onEnterPress,
    onBackspacePress,
    submittedGuesses,
    solution,
  }: KeyboardButtonsProps) => {
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

    const submittedLettersSet = new Set(
      submittedLetters.map((it) => it.letter)
    );

    const correctLetters = new Set(
      submittedLetters
        .filter(({ letter, index }) => solution[index] === letter)
        .map((it) => it.letter)
    );

    const misplacedLetters = new Set(
      submittedLetters
        .filter(
          ({ letter }) =>
            solution.includes(letter) && !correctLetters.has(letter)
        )
        .map((it) => it.letter)
    );

    const unusedLetterTextColor = useColorModeValue("black", "gray.50");
    const usedLetterTextColor = "gray.50";

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
);

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
const KeyButton = memo((props: ComponentProps<typeof Button>) => {
  const unusedLetterBg: string = useColorModeValue(
    "unusedLetter.100",
    "unusedLetter.400"
  );

  // Override the button colorScheme because native-base's default is too dark:
  const bgColor =
    props.colorScheme === "unusedLetter"
      ? unusedLetterBg
      : `${props.colorScheme}.500`;
  const hoverBgColor = bgColor.replace(/\d*$/, (num) =>
    String(Number(num) + 100)
  );
  const pressedBgColor = bgColor.replace(/\d*$/, (num) =>
    String(Number(num) + 200)
  );

  const btnText = props.children?.toString();

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
      bgColor={bgColor}
      _hover={{ bgColor: hoverBgColor }}
      _pressed={{ bgColor: pressedBgColor }}
      onPress={(e) => {
        props.onPress?.(e);
        // eslint-disable-next-line
        (e?.target as any)?.blur?.();
      }}
    />
  );
});
