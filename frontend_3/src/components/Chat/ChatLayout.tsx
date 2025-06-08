import React, { useState, useEffect, Suspense, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserDto } from "../../pages/dashboard/UserPage";
import ChatComponent from "./ChatComponent";
import UserPage from "../../pages/dashboard/UserPage";
import PageAccessTemplate from "../../components/dashboard/page-access/PageAccessTemplate";
import { FaComments } from "react-icons/fa";
import { getAccessToken } from "../../auth/session";
import useAuth from "../../hooks/useAuth.hook";
import * as signalR from "@microsoft/signalr";
import Swal from "sweetalert2";
import { ChatMessageDto } from "../Chat/ChatMessageDto";

const ChatLayout = () => {
  const [selectedReceiver, setSelectedReceiver] = useState<{
    id: string;
    userName: string;
  } | null>(null);
  const [userList, setUserList] = useState<UserDto[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const userIdRef = useRef<string | null>(user?.id || null);
  const receiverIdRef = useRef<string | null>(
    selectedReceiver?.id || userId || null
  );

  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!connectionRef.current) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7039/chathub", {
          accessTokenFactory: () => getAccessToken() || "",
        })
        .withAutomaticReconnect()
        .build();

      connection.on("ReceiveMessage", (message: ChatMessageDto) => {
        const currentUserId = userIdRef.current;
        const currentReceiverId = receiverIdRef.current;

        const isRelevant =
          (message.senderId === currentUserId &&
            message.receiverId === currentReceiverId) ||
          (message.senderId === currentReceiverId &&
            message.receiverId === currentUserId);

        if (!isRelevant) {
          Swal.fire({
            icon: "info",
            title: "Mesazh i ri",
            text: `Ke një mesazh të ri nga ${message.senderUsername}`,
            showConfirmButton: false,
            timer: 3000,
          });
        }
      });

      connection
        .start()
        .then(() => console.log("SignalR connected to /chathub"))
        .catch((err) => console.error("SignalR connection error:", err));

      connectionRef.current = connection;
    }

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    userIdRef.current = user?.id || null;
  }, [user?.id]);

  useEffect(() => {
    receiverIdRef.current = selectedReceiver?.id || userId || null;
  }, [selectedReceiver, userId]);

  useEffect(() => {
    const fetchReceiverDetails = async () => {
      if (!isAuthenticated) return;

      try {
        const token = getAccessToken();
        const res = await fetch("https://localhost:7039/api/Auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const users: UserDto[] = await res.json();
        setUserList(users.filter((u) => u.id !== user?.id));

        if (userId && !selectedReceiver?.userName) {
          const found = users.find((u) => u.id === userId);
          if (found) setSelectedReceiver(found);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchReceiverDetails();
  }, [userId, selectedReceiver?.userName, isAuthenticated, user?.id]);

  const handleSelectUserForChat = (id: string, userName: string) => {
    setSelectedReceiver({ id, userName });
    setShowDropdown(false);
    navigate(`/dashboard/chat/${id}`);
  };

  return (
    <div style={{ display: "flex", height: "90vh", border: "1px solid #ccc" }}>
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #eee",
          padding: "20px",
          position: "relative",
        }}
      >
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Chat with: {selectedReceiver?.userName || "Select user"}
        </button>

        {showDropdown && (
          <div className="mt-2 bg-white border rounded shadow-md z-10 absolute w-full max-h-60 overflow-y-auto">
            {userList.map((user) => (
              <div
                key={user.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectUserForChat(user.id, user.userName)}
              >
                {user.userName}
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          flexGrow: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Suspense fallback={<div>Loading Chat...</div>}>
          <ChatComponent
            receiverId={selectedReceiver?.id || userId || null}
            receiverUsername={selectedReceiver?.userName || "Loading..."}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default ChatLayout;
