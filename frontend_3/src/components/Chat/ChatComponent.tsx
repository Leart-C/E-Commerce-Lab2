import React, { useState, useEffect, useRef } from 'react'; 
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import { getAccessToken } from '../../auth/session';
import useAuth from '../../hooks/useAuth.hook';
import { ChatMessageDto } from './ChatMessageDto';

interface ChatComponentProps {
    receiverId: string | null;
    receiverUsername: string | null;
}

function ChatComponent({ receiverId, receiverUsername }: ChatComponentProps) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [messages, setMessages] = useState<ChatMessageDto[]>([]);
    const [messageInput, setMessageInput] = useState<string>('');

    const { isAuthenticated, user } = useAuth();

    // Use a ref to hold the *latest* receiverId without re-running useEffect for connection.on
    const receiverIdRef = useRef(receiverId);
    useEffect(() => {
        receiverIdRef.current = receiverId;
    }, [receiverId]);

    // Use a ref to hold the *latest* user.id
    const userIdRef = useRef(user?.id);
    useEffect(() => {
        userIdRef.current = user?.id;
    }, [user?.id]);


    // --- SignalR Connection Effect: Establishes and Manages Connection ---
    useEffect(() => {
        if (!isAuthenticated || !receiverId) {
            // ... (Your existing connection setup/teardown logic for !isAuthenticated || !receiverId)
            if (!isAuthenticated) console.warn("User not authenticated, not connecting to SignalR.");
            if (!receiverId) console.warn("No receiver selected, not connecting to SignalR.");
            
            if (connection) {
                connection.stop()
                    .then(() => console.log('SignalR connection stopped due to no receiver or unauthentication.'))
                    .catch(e => console.error('Error stopping connection:', e));
                setConnection(null); 
            }
            return; 
        }

        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:7039/chathub', {
                accessTokenFactory: () => {
                    const token = getAccessToken();
                    return token || '';
                }
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: retryContext => {
                    if (retryContext.elapsedMilliseconds < 10000) return 2000;
                    if (retryContext.elapsedMilliseconds < 60000) return 10000;
                    return 30000;
                }
            })
            .configureLogging(LogLevel.Information)
            .build();

        setConnection(newConnection);
        return () => {
            if (newConnection) {
                newConnection.stop()
                    .then(() => console.log('SignalR connection stopped during cleanup.'))
                    .catch(e => console.error('Error stopping connection during cleanup:', e));
            }
        };
    }, [isAuthenticated, receiverId]);


    // --- SignalR Event Listeners Effect: Registers handlers once connection is available ---
    useEffect(() => {
        if (connection) {
            connection.on('ReceiveMessage', (messageDto: ChatMessageDto) => {
                console.log('SignalR: Received message:', messageDto);
                // Check if the received message is relevant to the *currently active chat*
                // This is the crucial part that ensures live update only for the open chat
                const currentReceiverId = receiverIdRef.current;
                const currentUserId = userIdRef.current;

                // Check if the received message is for the currently active chat
                const isRelevantMessage = 
                    (messageDto.senderId === currentUserId && messageDto.receiverId === currentReceiverId) ||
                    (messageDto.senderId === currentReceiverId && messageDto.receiverId === currentUserId);

                if (isRelevantMessage) {
                    setMessages(prevMessages => {
                        if (prevMessages.some(msg => msg.id === messageDto.id)) {
                            return prevMessages;
                        }
                        return [...prevMessages, messageDto];
                    });
                } else {
                    console.log('SignalR: Received message for another chat, not updating current view.');
                    // Optionally, you might want to show a notification or update a badge for unread messages
                    // for that other chat here.
                }
            });

            connection.on('MessageEdited', (editedMessageDto: ChatMessageDto) => {
                console.log('SignalR: Message edited:', editedMessageDto);
                // Apply the same filtering logic for edits if you want to only update the current chat
                const currentReceiverId = receiverIdRef.current;
                const currentUserId = userIdRef.current;

                const isMessageForCurrentUser = editedMessageDto.receiverId === currentUserId && editedMessageDto.senderId === currentReceiverId;
                const isMessageFromCurrentUser = editedMessageDto.senderId === currentUserId && editedMessageDto.receiverId === currentReceiverId;

                if (isMessageForCurrentUser || isMessageFromCurrentUser) {
                    setMessages(prevMessages =>
                        prevMessages.map(msg => msg.id === editedMessageDto.id ? editedMessageDto : msg)
                    );
                }
            });

            connection.on('MessageDeleted', (deletedMessageId: number) => {
                console.log('SignalR: Message deleted:', deletedMessageId);
                // Apply the same filtering logic for deletes
                setMessages(prevMessages => {
                    const messageToDelete = prevMessages.find(msg => msg.id === deletedMessageId);
                    if (messageToDelete) {
                        const currentReceiverId = receiverIdRef.current;
                        const currentUserId = userIdRef.current;

                        const isMessageForCurrentUser = messageToDelete.receiverId === currentUserId && messageToDelete.senderId === currentReceiverId;
                        const isMessageFromCurrentUser = messageToDelete.senderId === currentUserId && messageToDelete.receiverId === currentReceiverId;

                        if (isMessageForCurrentUser || isMessageFromCurrentUser) {
                            return prevMessages.filter(msg => msg.id !== deletedMessageId);
                        }
                    }
                    return prevMessages; // Return original if not found or not for current chat
                });
            });

            connection.on('MessageSentConfirmation', (messageDto: ChatMessageDto) => {
                console.log('SignalR: Message sent confirmation received:', messageDto);
            });

            connection.start()
                .then(() => console.log('SignalR connection started successfully!'))
                .catch(e => {
                    console.error('Error starting SignalR connection:', e);
                    if (e.statusCode === 401) {
                        console.error('Authentication failed for SignalR. Please log in again.');
                    }
                });

            connection.onclose((error) => {
                if (error) {
                    console.error('Connection closed with error:', error);
                } else {
                    console.log('Connection closed cleanly.');
                }
            });
        }
    }, [connection]); 

    // --- NEW EFFECT: Load messages when receiverId changes ---
    useEffect(() => {
        const fetchMessages = async () => {
            if (isAuthenticated && receiverId) {
                try {
                    const token = getAccessToken();
                    if (!token) {
                        console.error("No access token found for fetching messages.");
                        setMessages([]);
                        return;
                    }

                    setMessages([]); // Clear messages when fetching new ones for a different chat

                    const response = await fetch(`https://localhost:7039/api/chat/messages/${receiverId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Failed to fetch messages');
                    }

                    const fetchedMessages: ChatMessageDto[] = await response.json();
                    setMessages(fetchedMessages);

                } catch (error: any) {
                    console.error('Error fetching conversation history:', error.message || error);
                    setMessages([]);
                }
            } else {
                setMessages([]);
            }
        };

        fetchMessages();
    }, [receiverId, isAuthenticated]);

    // --- Send Message Function ---
    const handleSendMessage = async () => {
        // ... (your existing validation checks)
        if (messageInput.trim() === '') {
            console.warn("Cannot send empty message.");
            return;
        }
        if (!isAuthenticated) {
            console.warn("Cannot send message: User not authenticated.");
            return;
        }
        if (!user) {
            console.warn("Cannot send message: Current user information not available.");
            return;
        }
        if (!receiverId) {
            console.warn("Cannot send message: No receiver selected.");
            return;
        }

        try {
            const token = getAccessToken();
            if (!token) {
                console.error("No access token found for API call.");
                return;
            }

            const response = await fetch('https://localhost:7039/api/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ReceiverId: receiverId,
                    Message: messageInput
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send message');
            }

            const sentMessage: ChatMessageDto = await response.json();

            // The sender adds the message immediately from the API response
            setMessages(prevMessages => {
                // Prevent duplicates if SignalR also sends it immediately (less likely with the new filter)
                if (prevMessages.some(msg => msg.id === sentMessage.id)) {
                    return prevMessages;
                }
                return [...prevMessages, sentMessage];
            });
            setMessageInput('');

        } catch (error: any) {
            console.error('Error sending message:', error.message || error);
        }
    };

    const handleEditMessage = async (messageId: number, currentMessage: string) => {
        // ... (your existing edit message logic)
        const newMessage = prompt('Edit your message:', currentMessage);
        if (newMessage !== null && newMessage.trim() !== '' && newMessage !== currentMessage) {
            try {
                const token = getAccessToken();
                if (!token) throw new Error("No access token found.");

                const response = await fetch(`https://localhost:7039/api/chat/messages/${messageId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ newMessage: newMessage.trim() })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to edit message');
                }
                console.log('Message edit request sent successfully.');
            } catch (error: any) {
                console.error('Error editing message:', error.message || error);
            }
        }
    };

    const handleDeleteMessage = async (messageId: number) => {
        // ... (your existing delete message logic)
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                const token = getAccessToken();
                if (!token) throw new Error("No access token found.");

                const response = await fetch(`https://localhost:7039/api/chat/messages/${messageId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete message');
                }

                console.log('Message delete request sent successfully.');
            } catch (error: any) {
                console.error('Error deleting message:', error.message || error);
            }
        }
    };

    return (
        <div style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column', border: '1px solid #ccc' }}>
            <h2>Chat with: {receiverUsername || 'Select a user'}</h2>
            <div style={{ flexGrow: 1, overflowY: 'scroll', border: '1px solid #eee', marginBottom: '10px', padding: '10px' }}>
                {receiverId === null ? (
                    <p>Select a user to start chatting.</p>
                ) : messages.length === 0 ? (
                    <p>No messages yet. Send a message to {receiverUsername} or load history.</p>
                ) : (
                    messages
                        // The rendering filter remains the same, it's correct for display
                        .filter(msg =>
                            (msg.senderId === user?.id && msg.receiverId === receiverId) ||
                            (msg.senderId === receiverId && msg.receiverId === user?.id)
                        )
                        .map((msg: ChatMessageDto) => (
                            <div key={msg.id} style={{ marginBottom: '5px', background: msg.senderId === user?.id ? '#e0f7fa' : '#fce4ec', padding: '5px', borderRadius: '5px' }}>
                                <strong>{msg.senderUsername || msg.senderId}:</strong> {msg.message}
                                <span style={{ fontSize: '0.8em', color: '#888', marginLeft: '10px' }}>
                                    {new Date(msg.timestampt).toLocaleTimeString()} {msg.isRead ? '(Read)' : ''}
                                </span>
                                {/* Add Edit/Delete buttons if sender */}
                                {msg.senderId === user?.id && (
                                    <span style={{ marginLeft: '10px' }}>
                                        <button onClick={() => handleEditMessage(msg.id, msg.message)} style={{ marginRight: '5px', fontSize: '0.7em' }}>Edit</button>
                                        <button onClick={() => handleDeleteMessage(msg.id)} style={{ fontSize: '0.7em' }}>Delete</button>
                                    </span>
                                )}
                            </div>
                        ))
                )}
            </div>
            <div>
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    style={{ width: 'calc(100% - 80px)', padding: '8px', marginRight: '5px' }}
                    disabled={!receiverId}
                />
                <button onClick={handleSendMessage} disabled={!connection || !isAuthenticated || !user || !receiverId}>Send</button>
            </div>

            {!isAuthenticated && <p style={{ color: 'red' }}>Please log in to chat.</p>}
            {!connection && isAuthenticated && <p style={{ color: 'orange' }}>Initializing chat...</p>}
            {connection && connection.state !== 'Connected' && isAuthenticated && <p style={{ color: 'orange' }}>Connection status: {connection.state}</p>}
            {connection && connection.state === 'Connected' && isAuthenticated && <p style={{ color: 'green' }}>Connected to chat!</p>}
        </div>
    );
}

export default ChatComponent;