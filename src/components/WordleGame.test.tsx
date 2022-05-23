import { fireEvent } from "@testing-library/react-native";
import { Animated } from "react-native";
import { renderWithContext } from "../test-util/render-with-context";
import { WordleGame } from "./WordleGame";

describe("WordleGame component", () => {
  it("Renders the initial blank state.", () => {
    const { ui } = renderWithContext(<WordleGame solution="HELLO" />);
    const letterRows = ui.getAllByTestId("letter-grid-row");
    const letterBoxes = ui.getAllByTestId("letter-box-text");

    // Renders all letter rows and boxes:
    expect(letterRows.length).toEqual(6);
    expect(letterBoxes.length).toEqual(30);

    // All letter boxes are blank:
    expect(letterBoxes.filter((node) => node.props.children)).toEqual([]);
  });

  it("Plays through a game where you win.", () => {
    const { ui } = renderWithContext(<WordleGame solution="HELLO" />);

    // Guess #1 with all wrong letters:
    {
      for (const key of ["A", "M", "I", "S", "S", "ENTER"]) {
        fireEvent.press(ui.getByTestId(`button-${key}`));
      }

      const firstRowLetters = ui.getAllByTestId("letter-box-text").slice(0, 5);
      const firstRowBoxes = ui.getAllByTestId("letter-box").slice(0, 5);

      // The guess is rendered in the first row:
      expect(firstRowLetters.map((node) => node.props.children)).toEqual([
        "A",
        "M",
        "I",
        "S",
        "S",
      ]);

      // All boxes should have the gray "usedLetter" color:
      expect(firstRowBoxes.map((node) => node.props["data-variant"])).toEqual([
        "usedLetter",
        "usedLetter",
        "usedLetter",
        "usedLetter",
        "usedLetter",
      ]);
    }

    // Guess #2 with a mix of correct and misplaced letters:
    {
      // Guess "OLLIE" because it has a mix of different results:
      for (const key of ["O", "L", "L", "I", "E", "ENTER"]) {
        fireEvent.press(ui.getByTestId(`button-${key}`));
      }
      const secondRowBoxes = ui.getAllByTestId("letter-box").slice(5, 10);
      const secondRowLetters = ui
        .getAllByTestId("letter-box-text")
        .slice(5, 10);

      // The guess is rendered in the second row:
      expect(secondRowLetters.map((node) => node.props.children)).toEqual([
        "O",
        "L",
        "L",
        "I",
        "E",
      ]);

      // The correct letter box colors are shown:
      expect(secondRowBoxes.map((node) => node.props["data-variant"])).toEqual([
        "misplaced",
        "misplaced",
        "correct",
        "usedLetter",
        "misplaced", // E: misplaced
      ]);

      // The keyboard buttons are colored correctly:
      expect(ui.getByTestId("button-O").props["colorScheme"]).toEqual(
        "misplaced"
      );
      expect(ui.getByTestId("button-L").props["colorScheme"]).toEqual(
        "correct"
      );
      expect(ui.getByTestId("button-I").props["colorScheme"]).toEqual(
        "usedLetter"
      );
      expect(ui.getByTestId("button-E").props["colorScheme"]).toEqual(
        "misplaced"
      );
    }

    // Guess #3 with the correct word:
    {
      // // Enter the solution:
      for (const key of ["H", "E", "L", "L", "O", "ENTER"]) {
        fireEvent.press(ui.getByTestId(`button-${key}`));
      }

      // The letter boxes are all the correct green color:
      const thirdRowBoxes = ui.getAllByTestId("letter-box").slice(10, 15);
      expect(thirdRowBoxes.map((node) => node.props["data-variant"])).toEqual([
        "correct",
        "correct",
        "correct",
        "correct",
        "correct",
      ]);
    }

    // Post-win UI:
    {
      // The win text is shown:
      expect(ui.getByText("WINNER!")).toBeTruthy();

      // Press the restart button:
      fireEvent.press(ui.getByText("Next Word"));
      const letters = ui.getAllByTestId("letter-box-text");

      // All the boxes are blank again:
      expect(letters.filter((node) => node.props.children)).toEqual([]);
    }
  });

  it("Plays through a game where you lose", () => {
    const { ui } = renderWithContext(<WordleGame solution="HELLO" />);

    // Guess with all wrong letters 6 times:
    for (let i = 0; i <= 5; i++) {
      // Enter the guess:
      for (const key of ["A", "M", "I", "S", "S", "ENTER"]) {
        fireEvent.press(ui.getByTestId(`button-${key}`));
      }
    }

    // Post-lose UI:
    {
      // The solution text is shown:
      expect(ui.getByText("SOLUTION")).toBeTruthy();
      expect(ui.getByText("HELLO")).toBeTruthy();

      // Press the restart button:
      fireEvent.press(ui.getByText("Next Word"));

      // All the boxes are blank again:
      const letterBoxes = ui.getAllByTestId("letter-box-text");
      expect(letterBoxes.filter((node) => node.props.children)).toEqual([]);
    }
  });

  it("Enters the text using the pressable keyboard UI", () => {
    const { ui } = renderWithContext(<WordleGame solution="HELLO" />);

    // Guess "OLLIE" because it has a mix of different results:
    fireEvent.press(ui.getByTestId("button-O"));
    fireEvent.press(ui.getByTestId("button-L"));
    fireEvent.press(ui.getByTestId("button-L"));
    fireEvent.press(ui.getByTestId("button-I"));
    fireEvent.press(ui.getByTestId("button-E"));
    fireEvent.press(ui.getByTestId("button-ENTER"));

    const firstRowBoxes = ui.getAllByTestId("letter-box").slice(0, 5);
    const firstRowLetters = ui.getAllByTestId("letter-box-text").slice(0, 5);

    // The guess is rendered in the second row:
    expect(firstRowLetters.map((node) => node.props.children)).toEqual([
      "O",
      "L",
      "L",
      "I",
      "E",
    ]);

    // The correct letter box colors are shown:
    expect(firstRowBoxes.map((node) => node.props["data-variant"])).toEqual([
      "misplaced", // O: misplaced
      "misplaced", // First L: misplaced
      "correct", // Second L: correct spot
      "usedLetter", // I: Not in the solution
      "misplaced", // E: misplaced
    ]);
  });

  it("Shows a toast message when you enter an unknown word", () => {
    const { ui } = renderWithContext(<WordleGame solution="HELLO" />);

    for (const key of ["A", "S", "D", "F", "G", "ENTER"]) {
      fireEvent.press(ui.getByTestId(`button-${key}`));
    }

    expect(ui.getByText("Word not in word list.")).toBeTruthy();
  });

  it("Shows a toast message when you enter a word that's too short", () => {
    const { ui } = renderWithContext(<WordleGame solution="HELLO" />);

    for (const key of ["R", "E", "D", "ENTER"]) {
      fireEvent.press(ui.getByTestId(`button-${key}`));
    }

    expect(ui.getByText("Not enough letters.")).toBeTruthy();
  });

  it("Lets you remove a letter by pressing backspace", () => {
    const { ui } = renderWithContext(<WordleGame solution="HELLO" />);

    for (const key of ["R", "E", "D", "BACK"]) {
      fireEvent.press(ui.getByTestId(`button-${key}`));
    }

    // The guess is rendered in the first row:
    const firstRowLetters = ui.getAllByTestId("letter-box-text").slice(0, 3);
    expect(firstRowLetters.map((node) => node.props.children)).toEqual([
      "R",
      "E",
      "",
    ]);
  });
});
