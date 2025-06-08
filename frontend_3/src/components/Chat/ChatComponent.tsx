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
    <div className="flex flex-col h-[calc(100vh-100px)] p-4 bg-white border rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Chat with:{" "}
        <span className="text-blue-600">
          {receiverUsername || "No one selected"}
        </span>
      </h2>
      <div className="flex-1 overflow-y-auto border p-4 mb-4 space-y-2">
        {receiverId === null ? (
          <p className="text-gray-500">Select a user to start chatting.</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
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
                className={`p-3 rounded-md ${
                  m.senderId === user?.id ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                <div className="font-medium">
                  {m.senderUsername || m.senderId}
                </div>
                <div>{m.message}</div>
                <div className="text-sm text-gray-500 flex items-center justify-between mt-1">
                  <span>
                    {new Date(m.timestampt).toLocaleTimeString()}{" "}
                    {m.isRead ? "✓" : ""}
                  </span>
                  {m.senderId === user?.id && (
                    <span className="space-x-2">
                      <button
                        onClick={() => handleEditMessage(m.id, m.message)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(m.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </span>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded shadow-sm"
          disabled={!receiverId}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          disabled={!connection || !user || !receiverId}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatComponent;
