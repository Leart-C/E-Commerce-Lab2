import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Badge,
  CircularProgress,
  Box,
} from "@mui/material";
import { FaUserCircle, FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../auth/session";
import useAuth from "../../hooks/useAuth.hook";
import { PATH_DASHBOARD } from "../../routes/paths";

export interface UserDto {
  id: string;
  userName: string;
}

interface UserPageProps {
  onSelectUserForChat?: (userId: string, username: string) => void;
}

const UserPage = ({ onSelectUserForChat }: UserPageProps) => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const fetchUnreadCounts = async () => {
    try {
      const token = getAccessToken();
      const response = await fetch(
        "https://localhost:7039/api/Chat/conversations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch conversations.");

      const data: {
        otherUserId: string;
        unreadMessageCount: number;
      }[] = await response.json();

      const countsMap: Record<string, number> = {};
      data.forEach((convo) => {
        countsMap[convo.otherUserId] = convo.unreadMessageCount;
      });

      setUnreadCounts(countsMap);
    } catch (err) {
      console.error("Error fetching unread message counts:", err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated) {
        setUsers([]);
        setLoading(false);
        setError("User not authenticated.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = getAccessToken();
        if (!token) {
          throw new Error("No access token found for fetching users.");
        }

        const response = await fetch("https://localhost:7039/api/Auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Failed to fetch users: ${errorData.message || response.statusText}`
          );
        }

        const data: UserDto[] = await response.json();
        const filteredUsers = data.filter((u) => u.id !== user?.id);
        setUsers(filteredUsers);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchUnreadCounts();
  }, [isAuthenticated, user?.id]);

  const handleChatClick = (userId: string, userName: string) => {
    if (onSelectUserForChat) {
      onSelectUserForChat(userId, userName);
    } else {
      navigate(PATH_DASHBOARD.chatWithUser(userId));
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
        minHeight: "100vh",
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#1565c0",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        👥 Përdoruesit në dispozicion për bisedë
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      )}

      {!loading && !error && users.length === 0 && (
        <Typography color="text.secondary">
          Nuk ka përdorues të tjerë për bisedë për momentin.
        </Typography>
      )}

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {users.map((u) => (
          <Grid item xs={12} sm={6} md={4} key={u.id}>
            <Card
              sx={{
                padding: 3,
                borderRadius: 4,
                backgroundColor: "#ffffff",
                transition: "all 0.3s ease",
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <FaUserCircle size={36} color="#1e88e5" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {u.userName}
                </Typography>
              </Box>

              <Badge
                badgeContent={unreadCounts[u.id] || 0}
                color="error"
                sx={{ mr: 1 }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<FaCommentDots />}
                  sx={{
                    background: "linear-gradient(to right, #42a5f5, #1e88e5)",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: 3,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      background: "linear-gradient(to right, #1e88e5, #1565c0)",
                    },
                  }}
                  onClick={() => handleChatClick(u.id, u.userName)}
                >
                  Chat
                </Button>
              </Badge>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserPage;
