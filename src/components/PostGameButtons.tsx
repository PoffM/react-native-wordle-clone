import { Box, Button, Flex, Heading, Text, VStack } from "native-base";
import { WordleState } from "../hooks/useWordleState";

export interface PostGameButtonsProps {
  wordleState: WordleState;
  onRestartClick: () => void;
}

export function PostGameButtons({
  wordleState: { status, solution },
  onRestartClick,
}: PostGameButtonsProps) {
  return (
    <VStack>
      {status === "LOST" && (
        <Box textAlign="center">
          <Heading size="sm">SOLUTION</Heading>
          <Text fontSize="3xl">{solution}</Text>
        </Box>
      )}
      {status === "WON" && (
        <Box textAlign="center">
          <Text fontSize="3xl">WINNER!</Text>
        </Box>
      )}
      <Flex w="100%">
        <Button flex={1} colorScheme="correct" onClick={onRestartClick}>
          Next Word
        </Button>
      </Flex>
    </VStack>
  );
}
