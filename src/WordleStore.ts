import { makeAutoObservable } from "mobx";
import COMMON_WORDS from "./word-list/common-words.json";
import UNCOMMON_WORDS from "./word-list/uncommon-words.json";

const VALID_WORDS = [...COMMON_WORDS, ...UNCOMMON_WORDS];

export interface WordleState {
  solution: string;
  maxGuesses: number;
  wordLength: number;
  submittedGuesses: string[];
  currentGuess: string;
  currentGuessError: { message: string } | null;
  status: "GUESSING" | "WON" | "LOST" | "REVEALING";
}

export class WordleStore {
  state: WordleState;

  constructor(solutionWord?: string) {
    this.state = makeInitialState(solutionWord);
    makeAutoObservable(this);
  }

  addLetterToGuess = (charCode: number) => {
    if (this.state.status !== "GUESSING") {
      return;
    }

    const newGuess = (
      this.state.currentGuess + String.fromCharCode(charCode)
    ).slice(0, this.state.wordLength);

    this.state.currentGuessError = null;
    this.state.currentGuess = newGuess;
  };

  removeLastLetterFromGuess = () => {
    if (this.state.status !== "GUESSING") {
      return;
    }

    this.state.currentGuessError = null;
    this.state.currentGuess = this.state.currentGuess.slice(0, -1);
  };

  submitGuess = () => {
    if (this.state.status !== "GUESSING") {
      return;
    }

    const currentGuessError =
      this.state.currentGuess.length < this.state.solution.length
        ? { message: "Not enough letters." }
        : !VALID_WORDS.includes(this.state.currentGuess)
        ? { message: "Word not in word list." }
        : null;

    if (currentGuessError) {
      this.state.currentGuessError = currentGuessError;
      return;
    }

    const newSubmittedGuesses = [
      ...this.state.submittedGuesses,
      this.state.currentGuess,
    ];

    const newStatus = "REVEALING";

    this.state.submittedGuesses = newSubmittedGuesses;
    this.state.currentGuess = "";
    this.state.status = newStatus;
  };

  continueGame = () => {
    if (this.state.status !== "REVEALING") {
      return;
    }

    const lastGuess =
      this.state.submittedGuesses[this.state.submittedGuesses.length - 1];

    const newStatus =
      lastGuess === this.state.solution
        ? "WON"
        : this.state.submittedGuesses.length >= this.state.maxGuesses
        ? "LOST"
        : "GUESSING";

    this.state.status = newStatus;
  };

  restart = () => {
    this.state = makeInitialState();
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
    solution,
    maxGuesses: 6,
    wordLength: solution.length,
    submittedGuesses: [] as string[],
    currentGuess: "",
    currentGuessError: null,
    status: "GUESSING",
  };
}
