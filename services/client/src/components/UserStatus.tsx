import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";

interface UserStatusProps {
  accessToken: string;
  isAuthenticated: () => boolean;
}

const UserStatus: React.FC<UserStatusProps> = ({
  accessToken,
  isAuthenticated,
}) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const getUserStatus = async () => {
      try {
        const options = {
          url: `${import.meta.env.VITE_API_SERVICE_URL}/auth/status`,
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const res = await axios(options);
        setEmail(res.data.email);
        setUsername(res.data.username);
      } catch (error) {
        console.log(error);
      }
    };
    getUserStatus();
  }, [accessToken]);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box p={4} maxW="1200px" mx="auto" mt={12}>
      <div>
        <p data-testid="user-email">{email}</p>
        <p data-testid="user-username">{username}</p>
      </div>
    </Box>
  );
};

export default UserStatus;
