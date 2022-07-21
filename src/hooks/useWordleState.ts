import { uniqueId } from "lodash";
import { useMemo, useState } from "react";
import COMMON_WORDS from "../word-list/common-words.json";
import UNCOMMON_WORDS from "../word-list/uncommon-words.json";

export interface WordleState {
  /** Unique ID per game instance. */
  playId: string;
  solution: string;
  maxGuesses: number;
  wordLength: number;
  submittedGuesses: string[];
  currentGuess: string;
  currentGuessError: { message: string } | null;
  status: "GUESSING" | "WON" | "LOST" | "REVEALING";
}

const VALID_WORDS = [...COMMON_WORDS, ...UNCOMMON_WORDS];

export interface WordleStateParams {
  solution?: string;
}

export function useWordleState(params: WordleStateParams = {}) {
  const [wordleState, setWordleState] = useState<WordleState>(() =>
    makeInitialState(params.solution)
  );

  return {
    wordleState,
    ...useMemo(
      () => ({
        addLetterToGuess: (charCode: number) => {
          setWordleState((state) => {
            if (state.status !== "GUESSING") {
              return state;
            }

            const newGuess = (
              state.currentGuess + String.fromCharCode(charCode)
            ).slice(0, state.wordLength);
            return {
              ...state,
              currentGuessError: null,
              currentGuess: newGuess,
            };
          });
        },

        removeLastLetterFromGuess: () => {
          setWordleState((state) => {
            if (state.status !== "GUESSING") {
              return state;
            }

            return {
              ...state,
              currentGuessError: null,
              currentGuess: state.currentGuess.slice(0, -1),
            };
          });
        },

        submitGuess: () => {
          setWordleState((state) => {
            if (state.status !== "GUESSING") {
              return state;
            }

            const currentGuessError =
              state.currentGuess.length < state.solution.length
                ? { message: "Not enough letters." }
                : !VALID_WORDS.includes(state.currentGuess)
                ? { message: "Word not in word list." }
                : null;

            if (currentGuessError) {
              return { ...state, currentGuessError };
            }

            const newSubmittedGuesses = [
              ...state.submittedGuesses,
              state.currentGuess,
            ];

            const newStatus = "REVEALING";

            return {
              ...state,
              submittedGuesses: newSubmittedGuesses,
              currentGuess: "",
              status: newStatus,
            };
          });
        },

        continueGame: () => {
          setWordleState((state) => {
            if (state.status !== "REVEALING") {
              return state;
            }

            const lastGuess =
              state.submittedGuesses[state.submittedGuesses.length - 1];

            const newStatus =
              lastGuess === state.solution
                ? "WON"
                : state.submittedGuesses.length >= state.maxGuesses
                ? "LOST"
                : "GUESSING";

            return { ...state, status: newStatus };
          });
        },

        restart: () => {
          setWordleState(() => makeInitialState());
        },
      }),
      []
    ),
  };
}

function makeInitialState(solutionWord?: string): WordleState {
  const solution = (
    solutionWord ??
    COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]
  )?.toUpperCase();

  if (!solution) {
    // Shouldn't happen:
    throw new Error("Random word selection failed.");
  }

  return {
    playId: uniqueId(),
    solution,
    maxGuesses: 6,
    wordLength: solution.length,
    submittedGuesses: [] as string[],
    currentGuess: "",
    currentGuessError: null,
    status: "GUESSING",
  };
}
