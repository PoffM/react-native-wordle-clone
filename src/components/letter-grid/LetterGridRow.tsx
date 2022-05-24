import { range } from "lodash";
import { HStack } from "native-base";
import { memo, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { LetterBox } from "./LetterBox";

export interface LetterGridRowProps {
  rowGuess?: string;
  solution: string;
  rowError?: { message: string } | null;
  isSubmitted: boolean;
  onRowRevealed?: () => void;
  /** Renders the letter boxes with the solution color already revealed. */
  initiallyRevealed?: boolean;
}

export const LetterGridRow = memo(function LetterGridRow({
  rowGuess,
  rowError,
  solution,
  isSubmitted,
  onRowRevealed,
  initiallyRevealed,
}: LetterGridRowProps) {
  // Shake horizontally when there is a new error:
  const { translateX } = useShakeAnimation(rowError);

  const remainingLetters = range(0, solution.length)
    .filter((idx) => rowGuess?.[idx] !== solution[idx])
    .map((idx) => solution[idx]);

  const columnData = range(0, solution.length).map((colNum) => {
    const letter = rowGuess?.charAt(colNum);
    const letterIsInRemainingLetters = Boolean(
      letter && remainingLetters.includes(letter)
    );
    const letterIsInRightSpot = Boolean(
      letter && solution.charAt(colNum) === letter
    );

    return { letter, letterIsInRightSpot, letterIsInRemainingLetters };
  });

  return (
    <Animated.View style={{ flexGrow: 1, transform: [{ translateX }] }}>
      <HStack testID="letter-grid-row" space={1.5}>
        {columnData.map((letterBoxData, letterPosition) => {
          const isLast = letterPosition === columnData.length - 1;

          return (
            <LetterBox
              {...letterBoxData}
              isSubmitted={isSubmitted}
              revealDelayMs={letterPosition * (1000 / columnData.length)}
              onRevealed={isLast ? onRowRevealed : undefined}
              key={letterPosition}
              initiallyRevealed={initiallyRevealed}
            />
          );
        })}
      </HStack>
    </Animated.View>
  );
});

function useShakeAnimation(rowError?: { message: string } | null) {
  // Shake horizontally when there is a new error:
  const translateXRef = useRef(new Animated.Value(0)); // Initial value for opacity: 0
  const translateX = translateXRef.current;

  useEffect(() => {
    if (rowError) {
      const shakePath = [0, -2, 2, -4, 4, -4, 2, -2, 0];
      const duration = 500 / shakePath.length;
      Animated.sequence(
        shakePath.map((x) =>
          Animated.timing(translateXRef.current, {
            useNativeDriver: true,
            toValue: x,
            duration,
          })
        )
      ).start();
    }
  }, [rowError]);

  return { translateX };
}
