import { Column, Row } from "native-base";
import { WordleGame } from "./WordleGame";
import { WordleHeader } from "./WordleHeader";

export function WordleScreen() {
  return (
    <Column h="100%">
      <WordleHeader />
      <Row flex={1} justifyContent="center">
        <WordleGame />
      </Row>
    </Column>
  );
}
