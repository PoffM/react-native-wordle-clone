import { renderWithContext } from "../test-util/render-with-context";
import { WordleHeader } from "./WordleHeader";

describe("WordleHeader", () => {
  it("Opens a How to Play modal when you click on the question mark button.", () => {
    const { ui } = renderWithContext(<WordleHeader />);

    ui.getByLabelText("Help").click();

    // Opens the Help modal:
    expect(ui.getByText("How to Play")).toBeTruthy();
    expect(ui.getByText("Guess the WORDLE in six tries.")).toBeTruthy();
  });
});
