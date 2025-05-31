import React, { useState, useEffect } from 'react';
import PageAccessTemplate from '../../components/dashboard/page-access/PageAccessTemplate';
import { FaUser, FaCommentDots } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../../auth/session';
import useAuth from '../../hooks/useAuth.hook';
import { PATH_DASHBOARD } from '../../routes/paths';

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
      const response = await fetch('https://localhost:7039/api/Chat/conversations', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch conversations.');

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
      console.error('Error fetching unread message counts:', err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated) {
        setUsers([]);
        setLoading(false);
        setError('User not authenticated.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = getAccessToken();
        if (!token) {
          throw new Error('No access token found for fetching users.');
        }

        const response = await fetch('https://localhost:7039/api/Auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch users: ${errorData.message || response.statusText}`);
        }

        const data: UserDto[] = await response.json();
        const filteredUsers = data.filter((u) => u.id !== user?.id);
        setUsers(filteredUsers);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchUnreadCounts();
  }, [isAuthenticated, user?.id]);

  const handleChatClick = (userId: string) => {
    if (onSelectUserForChat) {
      onSelectUserForChat(userId, 'Selected User');
    } else {
      navigate(PATH_DASHBOARD.chatWithUser(userId));
    }
  };

  return (
    <div className="pageTemplate2" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <PageAccessTemplate color="#FEC223" icon={FaUser} role="User" />

      <h2 style={{ marginTop: '20px', marginBottom: '15px' }}>Other Users</h2>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && users.length === 0 && !error && isAuthenticated && <p>No other users available to chat with.</p>}
      {!isAuthenticated && !loading && <p>Please log in to see other users.</p>}

      <div
        style={{
          border: '1px solid #eee',
          borderRadius: '8px',
          padding: '10px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        {!loading && !error && isAuthenticated && users.length > 0 && (
          <ul>
            {users.map((u) => (
              <li
                key={u.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  marginBottom: '5px',
                  borderBottom: '1px solid #f0f0f0',
                  listStyle: 'none',
                }}
              >
                <span>
                  <strong>{u.userName}</strong> (ID: {u.id})
                </span>
                <button
                  onClick={() => handleChatClick(u.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#007bff',
                    fontSize: '1.2em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    position: 'relative',
                  }}
                >
                  <FaCommentDots />
                  {unreadCounts[u.id] > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '35px',
                        background: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '2px 6px',
                        fontSize: '0.7em',
                        fontWeight: 'bold',
                        minWidth: '18px',
                        textAlign: 'center',
                      }}
                    >
                      {unreadCounts[u.id]}
                    </span>
                  )}
                  Chat
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserPage;