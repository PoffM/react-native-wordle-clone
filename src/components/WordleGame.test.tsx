import { waitFor } from "@testing-library/react";
import { renderWithContext } from "../test-util/render-with-context";
import { WordleGame } from "./WordleGame";

describe("WordleGame component", () => {
  it("Renders the initial blank state.", () => {
    const { ui } = renderWithContext(<WordleGame solution="HELLO" />);
    const letterRows = ui.getAllByTestId("letter-grid-row");
    const letterBoxes = ui.getAllByTestId("letter-box");

    // Renders all letter rows and boxes:
    expect(letterRows.length).toEqual(6);
    expect(letterBoxes.length).toEqual(30);

    // All letter boxes are blank:
    expect(letterBoxes.filter((node) => node.innerText)).toEqual([]);
  });

  it("Plays through a game where you win.", async () => {
    const { ui, user } = renderWithContext(<WordleGame solution="HELLO" />);

    // Guess #1 with all wrong letters:
    {
      await user.keyboard("{a}{m}{i}{s}{s}{Enter}");
      const firstRowBoxes = ui.getAllByTestId("letter-box").slice(0, 5);

      // The guess is rendered in the first row:
      expect(firstRowBoxes.map((node) => node.textContent)).toEqual([
        "A",
        "M",
        "I",
        "S",
        "S",
      ]);

      // All boxes should have the gray "usedLetter" color:
      expect(
        firstRowBoxes.map((node) => node.getAttribute("data-background-color"))
      ).toEqual([
        "usedLetter.500",
        "usedLetter.500",
        "usedLetter.500",
        "usedLetter.500",
        "usedLetter.500",
      ]);
    }

    // Guess #2 with a mix of correct and misplaced letters:
    {
      // Guess "OLLIE" because it has a mix of different results:
      await user.keyboard("{o}{l}{l}{i}{e}{Enter}");
      const secondRowBoxes = ui.getAllByTestId("letter-box").slice(5, 10);

      // The guess is rendered in the second row:
      expect(secondRowBoxes.map((node) => node.textContent)).toEqual([
        "O",
        "L",
        "L",
        "I",
        "E",
      ]);

      // The correct letter box colors are shown:
      expect(
        secondRowBoxes.map((node) => node.getAttribute("data-background-color"))
      ).toEqual([
        "misplaced.500", // O: misplaced
        "misplaced.500", // First L: misplaced
        "correct.500", // Second L: correct spot
        "usedLetter.500", // I: Not in the solution
        "misplaced.500", // E: misplaced
      ]);

      // The keyboard buttons are colored correctly:
      expect(
        ui.getByRole("button", { name: "O" }).getAttribute("data-color-scheme")
      ).toEqual("misplaced");
      expect(
        ui.getByRole("button", { name: "L" }).getAttribute("data-color-scheme")
      ).toEqual("correct");
      expect(
        ui.getByRole("button", { name: "I" }).getAttribute("data-color-scheme")
      ).toEqual("usedLetter");
      expect(
        ui.getByRole("button", { name: "E" }).getAttribute("data-color-scheme")
      ).toEqual("misplaced");
    }

    // Guess #3 with the correct word:
    {
      // // Enter the solution:
      await user.keyboard("{h}{e}{l}{l}{o}{Enter}");
      const thirdRowBoxes = ui.getAllByTestId("letter-box").slice(10, 15);

      // The letter boxes are all the correct green color:
      expect(
        thirdRowBoxes.map((node) => node.getAttribute("data-background-color"))
      ).toEqual([
        "correct.500",
        "correct.500",
        "correct.500",
        "correct.500",
        "correct.500",
      ]);
    }

    // Post-win UI:
    {
      // The win text is shown:
      expect(ui.getByText("WINNER!")).toBeTruthy();

      // Click the restart button:
      ui.getByRole("button", { name: "Next Word" }).click();
      const letterBoxes = ui.getAllByTestId("letter-box");

      // All the boxes are blank again:
      expect(letterBoxes.filter((node) => node.innerText)).toEqual([]);
    }
  });

  it("Plays through a game where you lose", async () => {
    const { ui, user } = renderWithContext(<WordleGame solution="HELLO" />);

    // Guess with all wrong letters 6 times:
    for (let i = 1; i <= 6; i++) {
      await user.keyboard("{a}{m}{i}{s}{s}{Enter}");
    }

    // Post-lose UI:
    {
      // The solution text is shown:
      expect(ui.getByText("SOLUTION")).toBeTruthy();
      expect(ui.getByText("HELLO")).toBeTruthy();

      // Click the restart button:
      ui.getByRole("button", { name: "Next Word" }).click();
      const letterBoxes = ui.getAllByTestId("letter-box");

      // All the boxes are blank again:
      expect(letterBoxes.filter((node) => node.innerText)).toEqual([]);
    }
  });

  it("Enters the text using the clickable keyboard UI", async () => {
    const { ui } = renderWithContext(<WordleGame solution="HELLO" />);

    // Guess "OLLIE" because it has a mix of different results:
    ui.getByRole("button", { name: "O" }).click();
    ui.getByRole("button", { name: "L" }).click();
    ui.getByRole("button", { name: "L" }).click();
    ui.getByRole("button", { name: "I" }).click();
    ui.getByRole("button", { name: "E" }).click();
    ui.getByRole("button", { name: /enter/i }).click();

    const firstRowBoxes = ui.getAllByTestId("letter-box").slice(0, 5);

    // The guess is rendered in the second row:
    expect(firstRowBoxes.map((node) => node.textContent)).toEqual([
      "O",
      "L",
      "L",
      "I",
      "E",
    ]);

    // The correct letter box colors are shown:
    await waitFor(() => {
      expect(
        firstRowBoxes.map((node) => node.getAttribute("data-background-color"))
      ).toEqual([
        "misplaced.500", // O: misplaced
        "misplaced.500", // First L: misplaced
        "correct.500", // Second L: correct spot
        "usedLetter.500", // I: Not in the solution
        "misplaced.500", // E: misplaced
      ]);
    });
  });

  it("Shows a toast message when you enter an unknown word", async () => {
    const { ui, user } = renderWithContext(<WordleGame solution="HELLO" />);

    await user.keyboard("{a}{s}{d}{f}{g}{Enter}");

    expect(ui.getByText("Word not in word list.")).toBeTruthy();
  });

  it("Shows a toast message when you enter a word that's too short", async () => {
    const { ui, user } = renderWithContext(<WordleGame solution="HELLO" />);

    await user.keyboard("{r}{e}{d}{Enter}");

    expect(ui.getByText("Not enough letters.")).toBeTruthy();
  });

  it("Lets you remove a letter by pressing backspace", async () => {
    const { ui, user } = renderWithContext(<WordleGame solution="HELLO" />);

    await user.keyboard("{r}{e}{d}{Backspace}");

    // The guess is rendered in the first row:
    const firstRowBoxes = ui.getAllByTestId("letter-box").slice(0, 3);
    expect(firstRowBoxes.map((node) => node.textContent)).toEqual([
      "R",
      "E",
      "",
    ]);
  });
});
