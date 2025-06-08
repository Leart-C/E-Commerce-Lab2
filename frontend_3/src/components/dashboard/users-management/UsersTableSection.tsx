import { useNavigate } from 'react-router-dom';
import { IAuthUser, RolesEnum } from '../../../types/auth.types';
import Button from '../../general/Button';
import moment from 'moment';
import { isAuthorizedForUpdateRole } from '../../../auth/auth.utils';
import useAuth from '../../../hooks/useAuth.hook';

interface IProps {
  usersList: IAuthUser[];
}

const RoleClassNameCreator = (roles: string[]) => {
  let className = 'px-3 py-1 text-white rounded-3xl bg-blue-400 text-center w-[100px]'; // shtova text-center dhe width
  if (roles.includes(RolesEnum.OWNER)) {
    className += ' bg-[#3b3549]';
  } else if (roles.includes(RolesEnum.ADMIN)) {
    className += ' bg-[#9333EA]';
  } else if (roles.includes(RolesEnum.MANAGER)) {
    className += ' bg-[#0B96BC]';
  } else if (roles.includes(RolesEnum.USER)) {
    className += ' bg-[#FEC223] text-black';
  }
  return className;
};

const UsersTableSection = ({ usersList }: IProps) => {
  const { user: loggedInUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Users Table</h2>
      <div className="grid grid-cols-7 gap-4 px-2 py-1 text-lg font-semibold border-b border-gray-300">
        <div>No</div>
        <div>User Name</div>
        <div>First Name</div>
        <div>Last Name</div>
        <div>Creation Time</div>
        <div className="flex justify-center">Roles</div>
        <div>Operations</div>
      </div>

      {usersList.map((user, index) => (
        <div
          key={user.id}
          className="grid grid-cols-7 gap-4 px-2 py-3 items-center border-b border-gray-200 hover:bg-blue-50 rounded-md"
        >
          <div>{index + 1}</div>
          <div className="font-semibold">{user.userName}</div>
          <div>{user.firstName}</div>
          <div>{user.lastName}</div>
          <div>{moment(user.createdAt).format('YYYY-MM-DD | HH:mm')}</div>
          <div className="flex justify-center">
            <span className={RoleClassNameCreator(user.roles)}>
              {user.roles[0]} {/* Nxjerr rolin kryesor */}
            </span>
          </div>
          <div>
            <Button
              label="Update"
              onClick={() => navigate(`/dashboard/update-role/${user.userName}`)}
              type="button"
              variant="primary"
              disabled={!isAuthorizedForUpdateRole(loggedInUser!.roles[0], user.roles[0])}
              className="w-[100px]" // për madhësi të njëjtë me badge-in
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersTableSection;
