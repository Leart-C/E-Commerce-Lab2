import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/general/Spinner';
import { IAuthUser, IUpdateRoleDto } from '../../types/auth.types';
import axiosInstance from '../../utils/axiosInstance';
import { UPDATE_ROLE_URL, USERS_LIST_URL } from '../../utils/globalConfig';
import { toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.hook';
import { allowedRolesForUpdateArray, isAuthorizedForUpdateRole } from '../../auth/auth.utils';
import Button from '../../components/general/Button';

const UpdateRolePage = () => {
  const { user: loggedInUser } = useAuth();
  const { userName } = useParams();
  const [user, setUser] = useState<IAuthUser>();
  const [role, setRole] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const getUserByUserName = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IAuthUser>(`${USERS_LIST_URL}/${userName}`);
      const { data } = response;
      if (!isAuthorizedForUpdateRole(loggedInUser!.roles[0], data.roles[0])) {
        setLoading(false);
        toast.error('You are not allowed to change role of this user');
        navigate('/dashboard/users-management');
      } else {
        setUser(data);
        setRole(data?.roles[0]);
        setLoading(false);
      }
    } catch (error) {
      setPostLoading(false);
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 403) {
        toast.error('You are not allowed to change role of this user');
      } else {
        toast.error('An Error occurred. Please contact admins');
      }
      navigate('/dashboard/users-management');
    }
  };

  const UpdateRole = async () => {
    try {
      if (!role || !userName) return;
      setPostLoading(true);
      const updateData: IUpdateRoleDto = {
        newRole: role,
        userName,
      };
      await axiosInstance.post(UPDATE_ROLE_URL, updateData);
      setPostLoading(false);
      toast.success('Role updated Successfully.');
      navigate('/dashboard/users-management');
    } catch (error) {
      setPostLoading(false);
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 403) {
        toast.error('You are not allowed to change role of this user');
      } else {
        toast.error('An Error occurred. Please contact admins');
      }
      navigate('/dashboard/users-management');
    }
  };

  useEffect(() => {
    getUserByUserName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[300px]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-xl mt-16 flex flex-col gap-8">
      <h1 className="text-3xl font-extrabold text-blue-800 text-center">Update Role</h1>

      <div className="flex flex-col gap-4 text-blue-900">
        <div className="flex justify-between items-center border border-blue-300 rounded-lg bg-blue-50 px-4 py-3">
          <span className="font-semibold text-lg">UserName:</span>
          <span className="font-bold text-xl bg-blue-200 px-3 py-1 rounded select-all">{userName}</span>
        </div>
        <div className="flex justify-between items-center border border-blue-300 rounded-lg bg-blue-50 px-4 py-3">
          <span className="font-semibold text-lg">Current Role:</span>
          <span className="font-bold text-xl bg-blue-200 px-3 py-1 rounded select-all">{user?.roles[0]}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="role" className="font-semibold text-blue-700 text-lg">
          New Role:
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-blue-400 rounded-md px-4 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {allowedRolesForUpdateArray(loggedInUser).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-6">
        <button
          onClick={() => navigate('/dashboard/users-management')}
          type="button"
          className="flex-1 py-3 bg-blue-100 text-blue-700 font-semibold rounded-md hover:bg-blue-200 transition"
        >
          Cancel
        </button>
        <button
          onClick={UpdateRole}
          type="button"
          disabled={postLoading}
          className={`flex-1 py-3 text-white font-semibold rounded-md transition ${
            postLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
          }`}
        >
          {postLoading ? 'Updating...' : 'Update'}
        </button>
      </div>
    </div>
  );
};

export default UpdateRolePage;
