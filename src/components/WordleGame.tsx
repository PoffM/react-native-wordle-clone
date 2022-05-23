import { get, range } from "lodash";
import {
  Alert,
  Box,
  Center,
  Flex,
  Row,
  Text,
  useToast,
  WarningIcon,
} from "native-base";
import { useEffect, useMemo } from "react";
import { useWordleState, WordleStateParams } from "../hooks/useWordleState";
import { KeyboardButtons } from "./KeyboardButtons";
import { LetterGrid } from "./letter-grid/LetterGrid";
import { PostGameButtons } from "./PostGameButtons";

const ALPHABET = range(0, 26).map((i) => String.fromCharCode(i + 65));

const doc = typeof document === "object" ? document : null;

/** Holds the game state and renders the game elements. */
export function WordleGame(params: WordleStateParams) {
  const toast = useToast();

  const {
    wordleState,
    addLetterToGuess,
    removeLastLetterFromGuess,
    submitGuess,
    continueGame,
    restart,
  } = useWordleState(params);

  // Show a toast if there is a guessing error:
  useEffect(() => {
    if (wordleState.currentGuessError) {
      const description = wordleState.currentGuessError.message;
      toast.show({
        duration: 2000,
        placement: "top",
        description,
        render: () => (
          <Alert status="warning">
            <Row space={2} alignItems="center">
              <WarningIcon color="black" />
              <Text color="black">{description}</Text>
            </Row>
          </Alert>
        ),
      });
    }
  }, [wordleState.currentGuessError]);

  // Key presses change the game state:
  useEffect(() => {
    function callGameFunction(event: KeyboardEvent) {
      if (ALPHABET.includes(event.key.toUpperCase())) {
        addLetterToGuess?.(event.key.toUpperCase().charCodeAt(0));
      }
      if (event.key === "Backspace") {
        removeLastLetterFromGuess?.();
      }
      if (
        event.key === "Enter" &&
        // Don't submit the guess if the user is tabbed to a button,
        // e.g. navigating the page keyboard-only:
        get(event.target, "type") !== "button"
      ) {
        submitGuess?.();
      }
    }
    doc?.addEventListener("keydown", callGameFunction);
    return () => doc?.removeEventListener("keydown", callGameFunction);
  }, [addLetterToGuess, removeLastLetterFromGuess, submitGuess]);

  // Defocus the button after clicking it,
  useEffect(() => {
    function blurElement() {
      // eslint-disable-next-line
      (doc?.activeElement as any)?.blur?.();
    }
    doc?.addEventListener("click", blurElement);
    return () => doc?.removeEventListener("click", blurElement);
  }, []);

  // Only reveal the new colors on the keyboard UI after the letter box colors have been revealed:
  const revealedGuesses = useMemo(
    () =>
      wordleState.status === "REVEALING"
        ? wordleState.submittedGuesses.slice(0, -1)
        : wordleState.submittedGuesses,
    [wordleState.status, wordleState.submittedGuesses]
  );

  return (
    <Flex width="100%" maxW={500} height="100%" flexDirection="column">
      <Center flex={1}>
        <LetterGrid wordleState={wordleState} onRowRevealed={continueGame} />
      </Center>
      <Box h={192}>
        {(wordleState.status === "WON" || wordleState.status === "LOST") && (
          <PostGameButtons onRestartPress={restart} wordleState={wordleState} />
        )}
        {(wordleState.status === "GUESSING" ||
          wordleState.status === "REVEALING") && (
          <KeyboardButtons
            submittedGuesses={revealedGuesses}
            solution={wordleState.solution}
            onLetterPress={addLetterToGuess}
            onBackspacePress={removeLastLetterFromGuess}
            onEnterPress={submitGuess}
          />
        )}
      </Box>
    </Flex>
  );
}
