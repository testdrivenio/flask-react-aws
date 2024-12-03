import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Box,
  Container,
} from "@chakra-ui/react";

interface MessageProps {
  messageType: "info" | "warning" | "success" | "error";
  messageText: string;
  onClose?: () => void;
}

const Message: React.FC<MessageProps> = ({
  messageType,
  messageText,
  onClose,
}) => {
  return (
    <Container maxW="container.2xl" px={4}>
      <Alert
        status={messageType}
        variant="solid"
        mt={4}
        borderRadius="md"
        display="flex"
        alignItems="center"
      >
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>{messageText}</AlertTitle>
        </Box>
        {onClose && (
          <CloseButton
            onClick={onClose}
            ml={2}
            size="sm"
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
          />
        )}
      </Alert>
    </Container>
  );
};

export default Message;
