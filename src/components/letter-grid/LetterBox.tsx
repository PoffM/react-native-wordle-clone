import { Center, Factory, Text, themeTools } from "native-base";
import { memo, useEffect, useRef, useState } from "react";
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

export const LetterBox = memo(
  ({
    letterIsInRightSpot,
    letterIsInRemainingLetters,
    letter,
    isSubmitted,
    revealDelayMs,
    onRevealed,
    initiallyRevealed = false,
  }: LetterBoxProps) => {
    const scale = useRef(new Animated.Value(1)).current;
    const rotateX = useRef(new Animated.Value(0)).current;

    // Pop-in animation when the letter is entered:
    useEffect(() => {
      void (async () => {
        if (letter) {
          Animated.sequence([
            Animated.timing(scale, {
              useNativeDriver: true,
              toValue: 0.8,
              duration: 0,
            }),
            Animated.timing(scale, {
              useNativeDriver: true,
              toValue: 1.1,
              duration: 40,
            }),
            Animated.timing(scale, {
              useNativeDriver: true,
              toValue: 1,
              duration: 80,
            }),
          ]).start();
        }
      })();
    }, [letter]);

    // Flip animation to reveal the answer:
    const [revealed, setRevealed] = useState(initiallyRevealed);
    useEffect(() => {
      if (isSubmitted && !revealed) {
        // Flip down:
        Animated.timing(rotateX, {
          useNativeDriver: true,
          toValue: 1,
          duration: 150,
          delay: revealDelayMs,
        }).start(() => {
          // Change the state to "revealed" when the box is at 90 degrees (which makes it invisible):
          setRevealed(true);
          onRevealed?.();
          // Flip back up:
          Animated.timing(rotateX, {
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
      : !!letter
      ? "staged"
      : undefined;

    return (
      <Animated.View
        style={{
          flex: 1,
          aspectRatio: 1,
          transform: [
            { scale },
            {
              rotateX: rotateX.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "-90deg"],
              }),
            },
          ],
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
  }
);

const LetterBoxView = Factory(Center as any, {
  baseStyle: (props) => ({
    size: "full",
    borderWidth: "2px",
    borderColor: themeTools.mode("gray.200", "gray.600")(props),
  }),
  variants: {
    staged: (props) => ({
      borderColor: themeTools.mode("gray.500", "gray.300")(props),
    }),
    correct: {
      borderWidth: "0px",
      bg: "correct.500",
    },
    misplaced: (props) => ({
      borderWidth: "0px",
      bg: themeTools.mode("misplaced.400", "misplaced.500")(props),
    }),
    usedLetter: {
      borderWidth: "0px",
      bg: "usedLetter.500",
    },
  },
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
