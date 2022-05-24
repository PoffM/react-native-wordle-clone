import { Center, Factory, Text, themeTools } from "native-base";
import { ComponentType, memo, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

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

export const LetterBox = memo(function LetterBox({
  letterIsInRightSpot,
  letterIsInRemainingLetters,
  letter,
  isSubmitted,
  revealDelayMs,
  onRevealed,
  initiallyRevealed = false,
}: LetterBoxProps) {
  const scaleRef = useRef(new Animated.Value(0));
  const scale = scaleRef.current.interpolate({
    inputRange: [0, 0.001, 0.33, 1],
    outputRange: [1, 0.8, 1.1, 1],
  });

  const flipAnimRef = useRef(new Animated.Value(0));
  const rotateX = flipAnimRef.current.interpolate({
    inputRange: [0, 1],
    // Not sure why but a rotation of -90deg causes the screen to flicker, so cap it a bit lower:
    outputRange: ["0deg", "-89.95deg"],
  });

  // Pop-in animation when the letter is entered:
  useEffect(() => {
    if (letter) {
      Animated.sequence([
        Animated.timing(scaleRef.current, {
          useNativeDriver: true,
          toValue: 0,
          duration: 0,
        }),
        Animated.timing(scaleRef.current, {
          useNativeDriver: true,
          toValue: 1,
          duration: 120,
        }),
      ]).start();
    }
  }, [letter]);

  // Flip animation to reveal the answer:
  const [revealed, setRevealed] = useState(initiallyRevealed);
  useEffect(() => {
    if (isSubmitted && !revealed) {
      // Flip down:
      Animated.timing(flipAnimRef.current, {
        useNativeDriver: true,
        toValue: 1,
        duration: 150,
        delay: revealDelayMs,
      }).start(() => {
        // Change the state to "revealed" when the box is at 90 degrees (which makes it invisible):
        setRevealed(true);
        onRevealed?.();
        // Flip back up:
        Animated.timing(flipAnimRef.current, {
          useNativeDriver: true,
          toValue: 0,
          duration: 150,
        }).start();
      });
    }
  }, [isSubmitted, revealed, revealDelayMs, onRevealed]);

  const letterBoxVariant = revealed
    ? letterIsInRightSpot
      ? "correct"
      : letterIsInRemainingLetters
      ? "misplaced"
      : "usedLetter"
    : letter
    ? "staged"
    : undefined;

  return (
    <Animated.View
      style={{
        flex: 1,
        aspectRatio: 1,
        transform: [{ scale }, { rotateX }],
      }}
    >
      <LetterBoxView
        testID="letter-box"
        data-variant={letterBoxVariant}
        variant={letterBoxVariant}
      >
        <Animated.View style={{ transform: [{ scale: 2.5 }] }}>
          <LetterBoxText
            textBreakStrategy="simple"
            testID="letter-box-text"
            variant={revealed ? "revealed" : undefined}
          >
            {letter}
          </LetterBoxText>
        </Animated.View>
      </LetterBoxView>
    </Animated.View>
  );
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const LetterBoxView = Factory(Center as ComponentType<unknown>, {
  baseStyle: (props) => ({
    size: "full",
    borderWidth: "2px",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    borderColor: themeTools.mode("gray.200", "gray.600")(props),
  }),
  variants: {
    staged: (props) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      borderColor: themeTools.mode("gray.500", "gray.300")(props),
    }),
    correct: {
      borderWidth: "0px",
      bg: "correct.500",
    },
    misplaced: (props) => ({
      borderWidth: "0px",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      bg: themeTools.mode("misplaced.400", "misplaced.500")(props),
    }),
    usedLetter: {
      borderWidth: "0px",
      bg: "usedLetter.500",
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

const LetterBoxText = Factory(Text, {
  baseStyle: {
    fontWeight: "bold",
  },
  variants: {
    revealed: {
      color: "white",
    },
  },
});
