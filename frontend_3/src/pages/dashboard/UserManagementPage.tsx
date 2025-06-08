import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { USERS_LIST_URL } from '../../utils/globalConfig';
import { IAuthUser } from '../../types/auth.types';
import LatestUsersSection from '../../components/dashboard/users-management/LatestUsersSection';
import UserChartSection from '../../components/dashboard/users-management/UserChartSection';
import UserCountSection from '../../components/dashboard/users-management/UserCountSection';
import UsersTableSection from '../../components/dashboard/users-management/UsersTableSection';
import { toast } from 'react-hot-toast';
import Spinner from '../../components/general/Spinner';

const UserManagementPage = () => {
  const [users, setUsers] = useState<IAuthUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getUsersList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IAuthUser[]>(USERS_LIST_URL);
      const { data } = response;
      setUsers(data);
      setLoading(false);
    } catch (error) {
      toast.error('An Error happened. Please Contact admins');
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsersList();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[300px] flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md mt-12">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-8 border-b-4 border-blue-400 pb-2">
        Users Management
      </h1>

      <UserCountSection usersList={users} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 my-8">
        <div className="lg:col-span-2 bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
          <UserChartSection usersList={users} />
        </div>
        <div className="lg:col-span-2 bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
          <LatestUsersSection usersList={users} />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
        <UsersTableSection usersList={users} />
      </div>
    </div>
  );
};

export default UserManagementPage;
