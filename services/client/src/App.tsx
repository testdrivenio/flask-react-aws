import React, { useState, useEffect } from "react";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import Users from "./components/Users";
import About from "./components/About";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import UserStatus from "./components/UserStatus";
import Message from "./components/Message";
import AddUserModal from "./components/AddUserModal";

interface User {
  created_date: string;
  email: string;
  id: number;
  username: string;
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [title] = useState("TestDriven.io");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<
    "info" | "warning" | "success" | "error" | null
  >(null);
  const [messageText, setMessageText] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const checkAuth = async () => {
      await validRefresh();
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAuthenticated = () => {
    return !!accessToken;
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVICE_URL}/users`,
      );
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRegisterFormSubmit = async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const url = `${import.meta.env.VITE_API_SERVICE_URL}/auth/register`;
      const response = await axios.post(url, data);
      console.log(response.data);
      createMessage("success", "Registration successful! You can now log in."); // Display success message
    } catch (err) {
      console.log(err);
      createMessage(
        "error",
        "Registration failed. The user might already exist.",
      ); // Display error message
    }
  };

  const handleLoginFormSubmit = async (data: {
    email: string;
    password: string;
  }) => {
    try {
      const url = `${import.meta.env.VITE_API_SERVICE_URL}/auth/login`;
      const response = await axios.post(url, data);
      console.log(response.data);
      setAccessToken(response.data.access_token);
      window.localStorage.setItem("refreshToken", response.data.refresh_token);
      await fetchUsers();
      createMessage("success", "Login successful!"); // Display success message
    } catch (err) {
      console.log(err);
      createMessage("error", "Login failed. Please check your credentials."); // Display error message
    }
  };

  const validRefresh = async () => {
    const token = window.localStorage.getItem("refreshToken");
    if (token) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_SERVICE_URL}/auth/refresh`,
          {
            refresh_token: token,
          },
        );
        setAccessToken(response.data.access_token);
        await fetchUsers();
        window.localStorage.setItem(
          "refreshToken",
          response.data.refresh_token,
        );
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
    return false;
  };

  const logoutUser = () => {
    setAccessToken(null);
    window.localStorage.removeItem("refreshToken");
    createMessage("info", "You have been logged out."); // Display success message
  };

  const clearMessage = () => {
    setMessageType(null);
    setMessageText(null);
  };

  const createMessage = (
    type: "info" | "warning" | "success" | "error",
    text: string,
  ) => {
    setMessageType(type);
    setMessageText(text);
    setTimeout(() => {
      clearMessage();
    }, 3000);
  };

  // Add a test message when the component mounts
  useEffect(() => {
    createMessage("info", "Welcome to the application!");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addUser = async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVICE_URL}/users`,
        {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          created_date: new Date().toISOString(),
        },
      );

      // Update the users state with the new user
      setUsers((prevUsers) => [...prevUsers, response.data]);
      createMessage("success", "User added successfully.");
      onClose(); // Close the modal
      await fetchUsers(); // Fetch the updated list of users
    } catch (err) {
      console.error(err);
      createMessage(
        "error",
        "Failed to add user. The user might already exist.",
      );
    }
  };

  const removeUser = async (userId: number) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_SERVICE_URL}/users/${userId}`,
      );
      await fetchUsers(); // Fetch the updated list of users
      createMessage("success", "User removed successfully.");
    } catch (err) {
      console.error(err);
      createMessage("error", "Failed to remove user. Please try again.");
    }
  };

  return (
    <ChakraProvider>
      <NavBar
        title={title}
        logoutUser={logoutUser}
        isAuthenticated={isAuthenticated}
      />
      {messageType && messageText && (
        <Message
          messageType={messageType}
          messageText={messageText}
          onClose={clearMessage} // Make sure this is passed
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Users
                users={users}
                onAddUser={onOpen}
                removeUser={removeUser}
                isAuthenticated={isAuthenticated()}
              />
              <AddUserModal
                isOpen={isOpen}
                onClose={onClose}
                addUser={addUser}
              />
            </>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/register"
          element={
            <RegisterForm
              onSubmit={handleRegisterFormSubmit}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginForm
              onSubmit={handleLoginFormSubmit}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/status"
          element={
            <UserStatus
              accessToken={accessToken || ""}
              isAuthenticated={isAuthenticated}
            />
          }
        />
      </Routes>
    </ChakraProvider>
  );
};

export default App;
