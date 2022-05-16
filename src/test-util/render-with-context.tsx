import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MotionConfig } from "framer-motion";
import { ReactElement } from "react";
import { AppWrapper } from "../pages/_app";

export function renderWithContext(jsx: ReactElement) {
  const ui = render(jsx, {
    wrapper: ({ children }) => (
      <AppWrapper>
        <MotionConfig reducedMotion="always">{children}</MotionConfig>
      </AppWrapper>
    ),
  });
  const user = userEvent.setup();

  return { ui, user };
}
