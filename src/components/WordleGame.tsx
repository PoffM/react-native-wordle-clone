import { get, range } from "lodash";
import { autorun } from "mobx";
import { Observer, observer } from "mobx-react-lite";
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
import { WordleStore } from "../WordleStore";
import { KeyboardButtons } from "./KeyboardButtons";
import { LetterGrid } from "./letter-grid/LetterGrid";
import { PostGameButtons } from "./PostGameButtons";

const ALPHABET = range(0, 26).map((i) => String.fromCharCode(i + 65));

const doc = typeof document === "object" ? document : null;

export interface WordleGameProps {
  solution?: string;
}

/** Holds the game state and renders the game elements. */
export const WordleGame = observer(function WordleGame({
  solution,
}: WordleGameProps) {
  const toast = useToast();

  const {
    state: wordleState,
    addLetterToGuess,
    removeLastLetterFromGuess,
    submitGuess,
    continueGame,
    restart,
  } = useMemo(() => new WordleStore(solution), [solution]);

  // Show a toast if there is a guessing error:
  useEffect(
    () =>
      autorun(() => {
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
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
  const revealedGuesses = () =>
    wordleState.status === "REVEALING"
      ? wordleState.submittedGuesses.slice(0, -1)
      : wordleState.submittedGuesses;

  return (
    <Flex
      width="100%"
      maxW={500}
      height="100%"
      flexDirection="column"
      padding={1.5}
    >
      <Center flex={1}>
        <LetterGrid wordleState={wordleState} onRowRevealed={continueGame} />
      </Center>
      <Box h={192}>
        <Observer>
          {() => (
            <>
              {(wordleState.status === "WON" ||
                wordleState.status === "LOST") && (
                <PostGameButtons
                  onRestartPress={restart}
                  wordleState={wordleState}
                />
              )}
              {(wordleState.status === "GUESSING" ||
                wordleState.status === "REVEALING") && (
                <KeyboardButtons
                  submittedGuesses={revealedGuesses}
                  solution={() => wordleState.solution}
                  onLetterPress={addLetterToGuess}
                  onBackspacePress={removeLastLetterFromGuess}
                  onEnterPress={submitGuess}
                />
              )}
            </>
          )}
        </Observer>
      </Box>
    </Flex>
  );
});
