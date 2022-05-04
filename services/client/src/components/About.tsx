import React from "react";
import { Box, Heading, Text, Divider, VStack } from "@chakra-ui/react";

const About = () => (
  <Box p={4} maxW="1200px" mx="auto" mt={12}>
    <VStack spacing={6} align="stretch">
      <Heading as="h1" size="2xl">
        About
      </Heading>
      <Divider />
      <Text fontSize="lg" className="content">
        Add something relevant here.
      </Text>
    </VStack>
  </Box>
);

export default About;
