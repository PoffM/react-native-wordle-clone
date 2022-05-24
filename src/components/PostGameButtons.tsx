import { observer } from "mobx-react-lite";
import { Button, Column, Heading, Row, Text } from "native-base";
import { WordleState } from "../WordleStore";

export interface PostGameButtonsProps {
  wordleState: WordleState;
  onRestartPress: () => void;
}

export const PostGameButtons = observer(function PostGameButtons({
  wordleState: { status, solution },
  onRestartPress,
}: PostGameButtonsProps) {
  return (
    <Column space={2}>
      {status === "LOST" && (
        <Row justifyContent="center">
          <Column alignItems="center">
            <Heading size="sm">SOLUTION</Heading>
            <Text fontSize="3xl">{solution}</Text>
          </Column>
        </Row>
      )}
      {status === "WON" && (
        <Row justifyContent="center">
          <Text fontSize="3xl">WINNER!</Text>
        </Row>
      )}
      <Row justifyContent="center">
        <Button flex={1} colorScheme="correct" onPress={onRestartPress}>
          Next Word
        </Button>
      </Row>
    </Column>
  );
});
