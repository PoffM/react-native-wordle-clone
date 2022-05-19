import { animated, useSpring } from "@react-spring/native";
import { Center, Factory, Text, themeTools } from "native-base";
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
  const { rotateX, scale } = useSpring({
    from: {
      rotateX: "0deg",
      scale: 1,
    },
  });

  // Pop-in animation when the letter is entered:
  useEffect(() => {
    void (async () => {
      if (letter) {
        scale.start({
          from: 1,
          to: async (next) => {
            await next({ from: 0.8, to: 1.1, config: { duration: 40 } });
            await next({ to: 1, config: { duration: 60 } });
          },
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

  const letterBoxVariant = revealed
    ? letterIsInRightSpot
      ? "correct"
      : letterIsInRemainingLetters
      ? "misplaced"
      : "usedLetter"
    : undefined;

  return (
    <animated.View
      data-testid="letter-box"
      data-variant={letterBoxVariant}
      data-revealed={revealed}
      style={{
        flex: 1,
        aspectRatio: 1,
        transform: [{ rotateX }, { scale }],
      }}
    >
      <LetterBoxView variant={letterBoxVariant}>
        <LetterBoxText variant={revealed ? "revealed" : undefined}>
          {letter}
        </LetterBoxText>
      </LetterBoxView>
    </animated.View>
  );
}

const LetterBoxView = Factory(Center as any, {
  baseStyle: (props) => ({
    size: "full",
    borderWidth: "2px",
    borderColor: themeTools.mode("gray.200", "gray.600")(props),
  }),
  variants: {
    staged: (props) => ({
      borderColor: themeTools.mode("light.600", "dark.600")(props),
    }),
    correct: {
      borderWidth: "0px",
      bg: "correct.500",
    },
    misplaced: {
      borderWidth: "0px",
      bg: "misplaced.500",
    },
    usedLetter: {
      borderWidth: "0px",
      bg: "usedLetter.500",
    },
  },
}) as any;

const LetterBoxText = Factory(Text, {
  baseStyle: {
    fontWeight: "bold",
    fontSize: "4xl",
  },
  variants: {
    revealed: {
      color: "gray.50",
    },
  },
});
