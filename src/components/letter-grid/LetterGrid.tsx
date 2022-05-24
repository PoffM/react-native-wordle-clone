import { range } from "lodash";
import { VStack } from "native-base";
import { memo } from "react";
import { WordleState } from "../../hooks/useWordleState";
import { LetterGridRow } from "./LetterGridRow";

export interface LetterGridProps {
  wordleState: WordleState;
  onRowRevealed?: () => void;
}

export const LetterGrid = memo(function LetterGrid({
  wordleState,
  onRowRevealed,
}: LetterGridProps) {
  return (
    <VStack
      width="full"
      maxW={330}
      space={1.5}
      margin={2}
      // Any component state should be lost when the solution is changed (e.g. for a new game):
      key={wordleState.solution}
    >
      {range(0, wordleState.maxGuesses).map((rowNum) => {
        const isCurrentGuess = rowNum === wordleState.submittedGuesses.length;
        const isSubmitted = rowNum in wordleState.submittedGuesses;
        const rowGuess = isCurrentGuess
          ? wordleState.currentGuess
          : wordleState.submittedGuesses[rowNum];

        const rowError = isCurrentGuess ? wordleState.currentGuessError : null;

        return (
          <LetterGridRow
            isSubmitted={isSubmitted}
            rowError={rowError}
            rowGuess={rowGuess}
            solution={wordleState.solution}
            onRowRevealed={onRowRevealed}
            key={rowNum}
          />
        );
      })}
    </VStack>
  );
});
