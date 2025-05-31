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
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        👥 Përdoruesit në dispozicion për bisedë
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      )}

      {!loading && !error && users.length === 0 && (
        <Typography>No other users available to chat with.</Typography>
      )}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {users.map((u) => (
          <Grid item xs={12} sm={6} md={4} key={u.id}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2,
                boxShadow: 3,
                borderRadius: 3,
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FaUserCircle size={32} color="#1976d2" />
                <Typography variant="h6">{u.userName}</Typography>
              </Box>

              <Badge
                badgeContent={unreadCounts[u.id] || 0}
                color="error"
                overlap="circular"
              >
                <Button
                  variant="outlined"
                  startIcon={<FaCommentDots />}
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