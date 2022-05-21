import { VStack } from "native-base";
import { range } from "lodash";
import { WordleState } from "../../hooks/useWordleState";
import { LetterGridRow, LetterGridRowProps } from "./LetterGridRow";

export interface LetterGridProps {
  wordleState: WordleState;
  onRowRevealed?: () => void;
}

export function LetterGrid({ wordleState, onRowRevealed }: LetterGridProps) {
  const { rows } = useLetterGridData({ wordleState });

  return (
    <VStack
      width="100%"
      maxW={336}
      space={1.5}
      margin={2}
      // Any component state should be lost when the solution is changed (e.g. for a new game):
      key={wordleState.solution}
    >
      {rows.map((rowData, rowNum) => (
        <LetterGridRow
          {...rowData}
          onRowRevealed={onRowRevealed}
          key={rowNum}
        />
      ))}
    </VStack>
  );
}

function useLetterGridData({ wordleState }: LetterGridProps) {
  const {
    maxGuesses,
    wordLength,
    currentGuess,
    submittedGuesses,
    solution,
    currentGuessError,
  } = wordleState;

  const rows = range(0, maxGuesses).map((rowNum) => {
    const isCurrentGuess = rowNum === submittedGuesses.length;
    const isSubmitted = Boolean(submittedGuesses[rowNum]);
    const rowGuess = isCurrentGuess ? currentGuess : submittedGuesses[rowNum];

    const remainingLetters = range(0, solution.length)
      .filter((idx) => rowGuess?.[idx] !== solution[idx])
      .map((idx) => solution[idx]);

    const rowError = isCurrentGuess ? currentGuessError : null;

    const rowData: LetterGridRowProps = {
      columnData: range(0, wordLength).map((colNum) => {
        const letter = rowGuess?.charAt(colNum);
        const letterIsInRemainingLetters = Boolean(
          letter && remainingLetters.includes(letter)
        );
        const letterIsInRightSpot = Boolean(
          letter && solution.charAt(colNum) === letter
        );

        return { letter, letterIsInRightSpot, letterIsInRemainingLetters };
      }),
      rowError,
      isSubmitted,
    };

    return rowData;
  });

  return { rows };
}
