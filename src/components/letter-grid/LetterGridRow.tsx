import { HStack } from "native-base";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { LetterBox, LetterBoxData } from "./LetterBox";

export interface LetterGridRowProps {
  columnData: LetterBoxData[];
  rowError?: { message: string } | null;
  isSubmitted: boolean;
  onRowRevealed?: () => void;
  /** Renders the letter boxes with the solution color already revealed. */
  initiallyRevealed?: boolean;
}

export function LetterGridRow({
  columnData,
  rowError,
  isSubmitted,
  onRowRevealed,
  initiallyRevealed,
}: LetterGridRowProps) {
  // Shake horizontally when there is a new error:
  const translateX = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    if (rowError) {
      const shakePath = [0, -2, 2, -4, 4, -4, 2, -2, 0];
      const duration = 500 / shakePath.length;
      Animated.sequence(
        shakePath.map((x) =>
          Animated.timing(translateX, {
            useNativeDriver: true,
            toValue: x,
            duration,
          })
        )
      ).start();
    }
  }, [rowError]);

  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      <HStack
        data-testid="letter-grid-row"
        flex={1}
        width="100%"
        space="0.3rem"
      >
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
}
