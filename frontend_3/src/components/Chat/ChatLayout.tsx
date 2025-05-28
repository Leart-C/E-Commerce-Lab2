import React, { useState, Suspense, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserDto } from '../../pages/dashboard/UserPage'; // Ensure UserDto is correctly imported
import ChatComponent from './ChatComponent';
import UserPage from '../../pages/dashboard/UserPage';
import PageAccessTemplate from '../../components/dashboard/page-access/PageAccessTemplate';
import { FaComments } from 'react-icons/fa';
import { getAccessToken } from '../../auth/session'; // Import getAccessToken
import useAuth from '../../hooks/useAuth.hook'; // Import useAuth if needed for token or current user id

const ChatLayout = () => {
    const [selectedReceiver, setSelectedReceiver] = useState<{ id: string; userName: string } | null>(null);
    const { userId } = useParams<{ userId: string }>(); // Get userId from URL
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth(); // To get the access token

    // Effect to fetch user details when userId from URL changes
    useEffect(() => {
        const fetchReceiverDetails = async () => {
            if (userId && !selectedReceiver?.userName) { // Only fetch if userId exists and username is missing
                if (!isAuthenticated) {
                    console.warn("User not authenticated, cannot fetch receiver details.");
                    return;
                }

                try {
                    const token = getAccessToken();
                    if (!token) {
                        throw new Error("No access token found for fetching user details.");
                    }

                    // Fetch all users to find the specific one by ID
                    const response = await fetch('https://localhost:7039/api/Auth/users', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Failed to fetch users for receiver details: ${errorData.message || response.statusText}`);
                    }

                    const usersData: UserDto[] = await response.json();
                    const foundUser = usersData.find(u => u.id === userId);

                    if (foundUser) {
                        setSelectedReceiver(foundUser);
                    } else {
                        console.warn(`User with ID ${userId} not found.`);
                        // Optionally, navigate to a general chat page or display an error
                        // navigate('/dashboard/chat'); 
                    }

                } catch (err: any) {
                    console.error("Error fetching receiver details:", err);
                    // Handle error, e.g., clear selectedReceiver, show message
                }
            }
        };

        // If the URL has a userId, and we haven't selected that user yet via the sidebar
        // or if the username is still a placeholder ('Loading...'), fetch details.
        if (userId && (selectedReceiver?.id !== userId || !selectedReceiver?.userName)) {
            fetchReceiverDetails();
        }
    }, [userId, selectedReceiver?.id, selectedReceiver?.userName, isAuthenticated]); // Re-run when userId or selectedReceiver's ID/username changes

    // handleSelectUserForChat remains the same as it correctly sets ID and username
    const handleSelectUserForChat = (id: string, userName: string) => {
        setSelectedReceiver({ id, userName });
        navigate(`/dashboard/chat/${id}`);
    };

    return (
        <div style={{ display: 'flex', height: '90vh', border: '1px solid #ccc' }}>
            {/* User List Sidebar */}
            <div style={{ width: '250px', borderRight: '1px solid #eee', padding: '10px', overflowY: 'auto' }}>
                <PageAccessTemplate color='#FEC223' icon={FaComments} role='Chat' />
                <h3 style={{ marginTop: '20px' }}>Your Contacts</h3>
                {/* Render UserPage inside ChatLayout, passing the selection handler */}
                <UserPage onSelectUserForChat={handleSelectUserForChat} />
            </div>

            {/* Main Chat Area */}
            <div style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <Suspense fallback={<div>Loading Chat...</div>}>
                    <ChatComponent
                        receiverId={selectedReceiver?.id || userId || null}
                        // Now, selectedReceiver.userName should contain the fetched username
                        receiverUsername={selectedReceiver?.userName || 'Loading chat partner...'}
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default ChatLayout;