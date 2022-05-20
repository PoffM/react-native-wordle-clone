import { render } from "@testing-library/react-native";
import { ReactElement } from "react";
import { AppWrapper } from "../../App";

const inset = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

/** Renders the App's components with the required contexts. */
export function renderWithContext(jsx: ReactElement) {
  const ui = render(jsx, {
    wrapper: ({ children }) => (
      <AppWrapper
        /**
         * initialWindowMetrics is required for NativeBase to work in tests:
         * https://docs.nativebase.io/next/testing
         */
        nativeBaseProps={{ initialWindowMetrics: inset }}
      >
        {children}
      </AppWrapper>
    ),
  });

  return { ui };
}
