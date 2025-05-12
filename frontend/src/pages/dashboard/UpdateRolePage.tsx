import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth.hook";
import { useEffect, useState } from "react";
import { IAuthUser, IUpdateRoleDto } from "../../types/auth.types";
import axiosInstance from "../../utils/axiosInstance";
import { UPDATE_ROLE_URL, USERS_LIST_URL } from "../../utils/globalConfig";
import {
  allowedRolesForUpdateArray,
  isAuthorizedForUpdateRole,
} from "../../auth/auth.utils";
import { PATH_DASHBOARD } from "../../routes/paths";
import toast from "react-hot-toast";
import Spinner from "../../components/general/Spinner";
import Button from "../../components/general/Button";

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
      const response = await axiosInstance.get<IAuthUser>(
        `${USERS_LIST_URL}/${userName}`
      );
      const { data } = response;
      if (!isAuthorizedForUpdateRole(loggedInUser!.roles[0], data.roles[0])) {
        setLoading(false);
        toast.error("You are not allowed to change role of this user");
        navigate(PATH_DASHBOARD.usersManagement);
      } else {
        setUser(data);
        setRole(data?.roles[0]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 404) {
        toast.error("UserName not Found!!");
      } else {
        toast.error("An Error occured. Please contact admins");
      }
      navigate(PATH_DASHBOARD.usersManagement);
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
      toast.success("Role Updated Successfully");
      navigate(PATH_DASHBOARD.usersManagement);
    } catch (error) {
      setPostLoading(false);
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 403) {
        toast.error("You are not allowed to change role of this user");
      } else {
        toast.error("An Error occured. Please contact admin");
      }
      navigate(PATH_DASHBOARD.usersManagement);
    }
  };

  useEffect(() => {
    getUserByUserName();
    UpdateRole();
  }, []);

  if (loading) {
    <div className="w-full">
      <Spinner />
    </div>;
  }

  return (
    <div className="p-4 w-2/4 mx-auto flex flex-col gap-4">
      <div className="bg-white p-2 rounded-md flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Update Role</h1>
        <div className="border border-dashed border-purple-300 rounded-md">
          <h4 className="text-xl">
            <span className="text-2xl font-bold ml-2 px-2 py-1 text-purple-600 rounded-md">
              {userName}
            </span>
            <h4 className="text-xl">
              Current Role:
              <span className="text-2xl font-bold ml-2 px-2 py-1 text-purple-600 rounded-md">
                {user?.roles[0]}
              </span>
            </h4>
          </h4>
        </div>
        <h4 className="text-xl font-bold">New Role</h4>

        <select
          value={role}
          className="w-80"
          onChange={(e) => setRole(e.target.value)}
        >
          {allowedRolesForUpdateArray(loggedInUser).map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-4 mt-12">
          <Button
            label="Cancel"
            onClick={() => navigate(PATH_DASHBOARD.usersManagement)}
            type="button"
            variant="secondary"
          />
          <Button
            label="Update"
            onClick={() => navigate(PATH_DASHBOARD.updateRole)}
            type="button"
            variant="primary"
            loading={postLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateRolePage;
