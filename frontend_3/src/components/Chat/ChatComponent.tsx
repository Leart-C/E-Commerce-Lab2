import React, { useState, useEffect, useRef } from "react";
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
} from "@microsoft/signalr";
import { getAccessToken } from "../../auth/session";
import useAuth from "../../hooks/useAuth.hook";
import { ChatMessageDto } from "./ChatMessageDto";

interface ChatComponentProps {
  receiverId: string | null;
  receiverUsername: string | null;
}

function ChatComponent({ receiverId, receiverUsername }: ChatComponentProps) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");

  const { isAuthenticated, user } = useAuth();

  const receiverIdRef = useRef(receiverId);
  const userIdRef = useRef(user?.id);

  useEffect(() => {
    receiverIdRef.current = receiverId;
  }, [receiverId]);

  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

  useEffect(() => {
    if (!isAuthenticated || !receiverId) {
      if (connection) {
        connection.stop().catch(console.error);
        setConnection(null);
      }
      return;
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7039/chathub", {
        accessTokenFactory: () => getAccessToken() || "",
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
    return () => {
      newConnection.stop().catch(console.error);
    };
  }, [isAuthenticated, receiverId]);

  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveMessage", (messageDto: ChatMessageDto) => {
      const currentReceiverId = receiverIdRef.current;
      const currentUserId = userIdRef.current;

      const isRelevant =
        (messageDto.senderId === currentUserId &&
          messageDto.receiverId === currentReceiverId) ||
        (messageDto.senderId === currentReceiverId &&
          messageDto.receiverId === currentUserId);

      if (isRelevant) {
        setMessages((prev) =>
          prev.some((m) => m.id === messageDto.id)
            ? prev
            : [...prev, messageDto]
        );
      }
    });

    connection.on("MessageEdited", (edited: ChatMessageDto) => {
      setMessages((prev) => prev.map((m) => (m.id === edited.id ? edited : m)));
    });

    connection.on("MessageDeleted", (deletedId: number) => {
      setMessages((prev) => prev.filter((m) => m.id !== deletedId));
    });

    connection.start().catch(console.error);

    return () => {
      connection.off("ReceiveMessage");
      connection.off("MessageEdited");
      connection.off("MessageDeleted");
    };
  }, [connection]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!isAuthenticated || !receiverId) return;
      const token = getAccessToken();
      if (!token) return;

      try {
        const res = await fetch(
          `https://localhost:7039/api/chat/messages/${receiverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data: ChatMessageDto[] = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [receiverId, isAuthenticated]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user || !receiverId) return;

    const token = getAccessToken();
    if (!token) return;

    try {
      const res = await fetch("https://localhost:7039/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ReceiverId: receiverId, Message: messageInput }),
      });

      if (res.ok) {
        const sent: ChatMessageDto = await res.json();
        setMessages((prev) =>
          prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]
        );
        setMessageInput("");
      }
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  const handleEditMessage = async (id: number, current: string) => {
    const newMsg = prompt("Edit message:", current);
    if (!newMsg || newMsg.trim() === current) return;

    const token = getAccessToken();
    try {
      await fetch(`https://localhost:7039/api/chat/messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newMessage: newMsg }),
      });
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!window.confirm("Delete this message?")) return;
    const token = getAccessToken();
    try {
      await fetch(`https://localhost:7039/api/chat/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div
      style={{
        height: "calc(100vh - 100px)", // ose 'calc(100vh - 250px)' për dinamike
        overflowY: "auto",
        border: "1px solid #eee",
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
      }}
    >
      <h2>Chat with: {receiverUsername || "No one selected"}</h2>
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          border: "1px solid #eee",
          padding: 10,
          marginBottom: 10,
        }}
      >
        {receiverId === null ? (
          <p>Select a user to start chatting.</p>
        ) : messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages
            .filter(
              (m) =>
                (m.senderId === user?.id && m.receiverId === receiverId) ||
                (m.senderId === receiverId && m.receiverId === user?.id)
            )
            .map((m) => (
              <div
                key={m.id}
                style={{
                  background: m.senderId === user?.id ? "#d0f0c0" : "#f0f0f0",
                  padding: 10,
                  marginBottom: 5,
                  borderRadius: 5,
                }}
              >
                <strong>{m.senderUsername || m.senderId}</strong>: {m.message}
                <div style={{ fontSize: "0.8em", color: "#666" }}>
                  {new Date(m.timestampt).toLocaleTimeString()}
                  {m.isRead ? " ✓" : ""}
                  {m.senderId === user?.id && (
                    <span style={{ marginLeft: 10 }}>
                      <button
                        onClick={() => handleEditMessage(m.id, m.message)}
                        style={{ marginRight: 5 }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteMessage(m.id)}>
                        Delete
                      </button>
                    </span>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 10 }}
          disabled={!receiverId}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          disabled={!connection || !user || !receiverId}
          style={{ padding: "0 20px", marginLeft: 5 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatComponent;
