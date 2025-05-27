import React, { useState, useEffect } from 'react'; 
import PageAccessTemplate from '../../components/dashboard/page-access/PageAccessTemplate';
import { FaUser } from 'react-icons/fa';
import { getAccessToken } from '../../auth/session'; 
import useAuth from '../../hooks/useAuth.hook'; 


export interface UserDto {
    id: string;
    userName: string;
  
};

const UserPage = () => {
    const [users, setUsers] = useState<UserDto[]>([]); 
    const [loading, setLoading] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null); 

    const { isAuthenticated, user } = useAuth(); 

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

                // IMPORTANT: Use your actual backend API URL for the AuthController
                const response = await fetch('http://localhost:7039/api/Auth/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to fetch users: ${errorData.message || response.statusText}`);
                }

                const data: UserDto[] = await response.json();
                // Filter out the current user from the list, as you generally don't chat with yourself
                const filteredUsers = data.filter(u => u.id !== user?.id);
                setUsers(filteredUsers);
            } catch (err: any) {
                console.error("Error fetching users:", err);
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchUsers();
    }, [isAuthenticated, user?.id]); // Re-run if auth status or current user ID changes

    return (
        <div className='pageTemplate2' style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
            <PageAccessTemplate color='#FEC223' icon={FaUser} role='User' />

            <h2 style={{ marginTop: '20px', marginBottom: '15px' }}>Other Users</h2>

            {loading && <p>Loading users...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && users.length === 0 && !error && isAuthenticated && <p>No other users available to chat with.</p>}
            {!isAuthenticated && !loading && <p>Please log in to see other users.</p>}

            <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                {!loading && !error && isAuthenticated && users.length > 0 && (
                    <ul>
                        {users.map((u) => (
                            <li
                                key={u.id}
                                style={{
                                    padding: '10px',
                                    marginBottom: '5px',
                                    borderBottom: '1px solid #f0f0f0',
                                    cursor: 'pointer',
                                    listStyle: 'none'
                                }}
                                // TODO: Add onClick handler here to select a user and maybe navigate to chat
                            >
                                <strong>{u.userName}</strong> (ID: {u.id})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserPage;