import { Box, Button, Flex, Heading, Text, VStack } from "native-base";
import { WordleState } from "../hooks/useWordleState";

export interface PostGameButtonsProps {
  wordleState: WordleState;
  onRestartPress: () => void;
}

export function PostGameButtons({
  wordleState: { status, solution },
  onRestartPress,
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
        <Button flex={1} colorScheme="correct" onPress={onRestartPress}>
          Next Word
        </Button>
      </Flex>
    </VStack>
  );
}
