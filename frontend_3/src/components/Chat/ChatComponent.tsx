import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import { getAccessToken } from '../../auth/session'; 
import useAuth from '../../hooks/useAuth.hook'; 
import { ChatMessageDto } from './ChatMessageDto'; 


interface ChatComponentProps {
    receiverId: string | null;
    receiverUsername: string | null;
    
    // onReceiverChange: (newReceiverId: string) => void;
}

// Accept props here
function ChatComponent({ receiverId, receiverUsername }: ChatComponentProps) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [messages, setMessages] = useState<ChatMessageDto[]>([]);
    const [messageInput, setMessageInput] = useState<string>('');

    const { isAuthenticated, user } = useAuth(); 

    // --- SignalR Connection Effect: Establishes and Manages Connection ---
    // This effect now depends on 'isAuthenticated' and 'receiverId'.
    // The connection will only be attempted if both are available.
    // If 'receiverId' changes or becomes null, the connection will be stopped/re-established.
    useEffect(() => {
       
        if (!isAuthenticated || !receiverId) {
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
            .withUrl('http://localhost:7039/chathub', {
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
    useEffect(() => {
        if (connection) {
            
            connection.on('ReceiveMessage', (messageDto: ChatMessageDto) => {
                console.log('Received message:', messageDto);
                setMessages(prevMessages => [...prevMessages, messageDto]);
            });

            connection.on('MessageEdited', (editedMessageDto: ChatMessageDto) => {
                console.log('Message edited:', editedMessageDto);
                setMessages(prevMessages =>
                    prevMessages.map(msg => msg.Id === editedMessageDto.Id ? editedMessageDto : msg)
                );
            });

            connection.on('MessageDeleted', (deletedMessageId: string) => { 
                console.log('Message deleted:', deletedMessageId);
                setMessages(prevMessages =>
                    prevMessages.filter(msg => msg.Id !== deletedMessageId)
                );
            });

            connection.on('MessageSentConfirmation', (messageDto: ChatMessageDto) => {
                console.log('Message sent confirmation received:', messageDto);
               
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

   
    const handleSendMessage = async () => {
       
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

            const response = await fetch('http://localhost7039/api/chat/send', {
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
            setMessages(prevMessages => [...prevMessages, sentMessage]);
            setMessageInput(''); 

        } catch (error: any) { 
            console.error('Error sending message:', error.message || error);
        }
    };

    return (
       
        <div style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column', border: '1px solid #ccc' }}>
            <h2>Chat with: {receiverUsername || 'Select a user'}</h2> 
            <div style={{ flexGrow: 1, overflowY: 'scroll', border: '1px solid #eee', marginBottom: '10px', padding: '10px' }}>
                {receiverId === null ? (
                    <p>Select a user to start chatting.</p> 
                ) : messages.length === 0 ? (
                    <p>No messages yet. Send a message to {receiverUsername}.</p>
                ) : (
                    messages.map((msg: ChatMessageDto, index) => ( 
                        <div key={index} style={{ marginBottom: '5px', background: msg.SenderId === user?.id ? '#e0f7fa' : '#fce4ec', padding: '5px', borderRadius: '5px' }}>
                            <strong>{msg.SenderUsername || msg.SenderId}:</strong> {msg.Message}
                            <span style={{ fontSize: '0.8em', color: '#888', marginLeft: '10px' }}>
                                {new Date(msg.Timestampt).toLocaleTimeString()} {msg.IsRead ? '(Read)' : ''}
                            </span>
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