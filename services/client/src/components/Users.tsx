import React from "react";
import {
  Heading,
  Box,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Button,
} from "@chakra-ui/react";

interface User {
  created_date: string;
  email: string;
  id: number;
  username: string;
}

interface UsersProps {
  users: User[];
  onAddUser: () => void;
  removeUser: (userId: number) => void;
  isAuthenticated: boolean;
}

const Users: React.FC<UsersProps> = ({
  users,
  onAddUser,
  removeUser,
  isAuthenticated,
}) => {
  return (
    <Box p={4} maxW="1200px" mx="auto">
      <Heading
        as="h1"
        size="xl"
        mb={6}
        mt={12}
        textAlign="left"
        color="gray.700"
      >
        Users
      </Heading>
      {isAuthenticated && (
        <Button colorScheme="blue" onClick={onAddUser} mb={4}>
          Add User
        </Button>
      )}
      <Divider borderColor="gray.400" />

      {users.length > 0 ? (
        <Table variant="simple" mt={4}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Username</Th>
              <Th>Email</Th>
              <Th>Created Date</Th>
              {isAuthenticated && <Th>Actions</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.username}</Td>
                <Td>{user.email}</Td>
                <Td>{new Date(user.created_date).toLocaleString()}</Td>
                {isAuthenticated && (
                  <Td>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => removeUser(user.id)}
                    >
                      Delete
                    </Button>
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text mt={4} color="gray.500" textAlign="center">
          There are no registered users.
        </Text>
      )}
    </Box>
  );
};

export default Users;
