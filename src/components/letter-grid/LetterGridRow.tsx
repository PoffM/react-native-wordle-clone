import { animated, useSpring } from "@react-spring/native";
import { HStack } from "native-base";
import { useEffect } from "react";
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
  const { shakeX } = useSpring({ from: { shakeX: 0 } });
  const translateX = shakeX.to({
    range: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    output: [0, -2, 2, -4, 4, -4, 2, -2, 0],
  });

  useEffect(() => {
    if (rowError) {
      shakeX.start({
        from: 0,
        to: 8,
        config: { duration: 500 },
      });
    }
  }, [rowError]);

  return (
    <animated.View style={{ transform: [{ translateX }] }}>
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
    </animated.View>
  );
}
