import { animated, useSpring } from "@react-spring/native";
import { Center, Text, useColorModeValue } from "native-base";
import { useEffect, useState } from "react";

export interface LetterBoxData {
  letterIsInRightSpot?: boolean;
  letterIsInRemainingLetters?: boolean;
  letter?: string;
}

export interface LetterBoxProps extends LetterBoxData {
  isSubmitted: boolean;
  revealDelayMs?: number;
  onRevealed?: () => void;
  /** Renders the letter box with the solution color already revealed. */
  initiallyRevealed?: boolean;
}

export function LetterBox({
  letterIsInRightSpot,
  letterIsInRemainingLetters,
  letter,
  isSubmitted,
  revealDelayMs,
  onRevealed,
  initiallyRevealed = false,
}: LetterBoxProps) {
  const textColor = useColorModeValue(undefined, "whiteAlpha.900");
  const hasLetterBorderColor = useColorModeValue(
    "blackAlpha.600",
    "whiteAlpha.600"
  );

  const { rotateX, popInX } = useSpring({
    from: {
      rotateX: "0deg",
      popInX: 0,
    },
  });

  const scale = popInX.to({
    range: [0, 1, 1.4, 2],
    output: [1, 0.8, 1.1, 1],
  });

  // Pop-in animation when the letter is entered:
  useEffect(() => {
    void (async () => {
      if (letter) {
        popInX.start({
          from: 1,
          to: 2,
          config: { duration: 100 },
        });
      }
    })();
  }, [letter]);

  // Flip animation to reveal the answer:
  const [revealed, setRevealed] = useState(initiallyRevealed);
  useEffect(() => {
    if (isSubmitted && !revealed) {
      void rotateX.start({
        from: "0deg",
        to: async (next) => {
          await next("-90deg");
          setRevealed(true);
          onRevealed?.();
          await next("0deg");
        },
        delay: revealDelayMs,
        config: { duration: 150 },
      });
    }
  }, [isSubmitted, revealed, revealDelayMs, onRevealed]);

  const bgColor = revealed
    ? letterIsInRightSpot
      ? "correct.500"
      : letterIsInRemainingLetters
      ? "misplaced.500"
      : "usedLetter.500"
    : undefined;

  return (
    <animated.View
      data-testid="letter-box"
      data-background-color={bgColor}
      data-revealed={revealed}
      style={{
        flex: 1,
        aspectRatio: 1,
        transform: [{ rotateX }, {scale}],
      }}
    >
      <Center
        size="full"
        borderWidth={revealed ? undefined : "2px"}
        borderColor={letter && hasLetterBorderColor}
        bg={bgColor}
      >
        <Text
          fontWeight="bold"
          fontSize="4xl"
          color={revealed ? "whiteAlpha.900" : textColor}
        >
          {letter}
        </Text>
      </Center>
    </animated.View>
  );
}
