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
}
