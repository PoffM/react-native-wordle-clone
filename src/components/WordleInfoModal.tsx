import { Box, Button, Divider, Modal, Text, VStack } from "native-base";
import { LetterGridRow } from "./letter-grid/LetterGridRow";

export interface WordleInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WordleInfoModal({ isOpen, onClose }: WordleInfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>How to Play</Modal.Header>
        <Modal.CloseButton />
        <Modal.Body>
          <VStack space={2}>
            <Text>Guess the WORDLE in six tries.</Text>
            <Text>
              Each guess must be a valid five-letter word. Hit the enter button
              to submit.
            </Text>
            <Text>
              After each guess, the color of the tiles will change to show how
              close your guess was to the word.
            </Text>
            <Divider />
            <VStack space={4}>
              <Text fontWeight="bold">Examples</Text>
              <Box>
                <Box w={280} mb={1}>
                  <LetterGridRow
                    columnData={[
                      {
                        letter: "W",
                        letterIsInRightSpot: true,
                      },
                      { letter: "E" },
                      { letter: "A" },
                      { letter: "R" },
                      { letter: "Y" },
                    ]}
                    isSubmitted={true}
                    initiallyRevealed={true}
                  />
                </Box>
                <Text>
                  The letter W is in the word and in the correct spot.
                </Text>
              </Box>
              <Box>
                <Box w={280} mb={1}>
                  <LetterGridRow
                    columnData={[
                      { letter: "P" },
                      { letter: "I", letterIsInRemainingLetters: true },
                      { letter: "L" },
                      { letter: "L" },
                      { letter: "S" },
                    ]}
                    isSubmitted={true}
                    initiallyRevealed={true}
                  />
                </Box>
                <Text>The letter I is in the word but in the wrong spot.</Text>
              </Box>
              <Box>
                <Box w={280} mb={1}>
                  <LetterGridRow
                    columnData={[
                      { letter: "V" },
                      { letter: "A" },
                      { letter: "G" },
                      { letter: "U" },
                      { letter: "E" },
                    ]}
                    isSubmitted={true}
                    initiallyRevealed={true}
                  />
                </Box>
                <Text>No letters in the guess are in the word.</Text>
              </Box>
            </VStack>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={onClose}>Close</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
