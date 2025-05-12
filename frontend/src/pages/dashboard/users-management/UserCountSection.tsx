// import { color } from "chart.js/helpers";
import { IAuthUser, RolesEnum } from "../../../types/auth.types";
import UserCountCard from "./UserCountCard";
import { FaUser, FaUserCog, FaUserShield, FaUserTie } from "react-icons/fa";

interface IProps {
  usersList: IAuthUser[];
}

const UserCountSection = ({ usersList }: IProps) => {
  let owners = 0;
  let admin = 0;
  let managers = 0;
  let users = 0;

  usersList.forEach((item) => {
    if (item.roles.includes(RolesEnum.OWNER)) {
      owners++;
    } else if (item.roles.includes(RolesEnum.ADMIN)) {
      admin++;
    } else if (item.roles.includes(RolesEnum.MANAGER)) {
      managers++;
    } else if (item.roles.includes(RolesEnum.USER)) {
      users++;
    }
  });

  const userCountData = [
    { count: owners, role: RolesEnum.OWNER, icon: FaUserCog, color: "#3b3549" },
    {
      count: admin,
      role: RolesEnum.ADMIN,
      icon: FaUserShield,
      color: "#9333ea",
    },
    {
      count: managers,
      role: RolesEnum.MANAGER,
      icon: FaUserTie,
      color: "#0b96bc",
    },
    { count: users, role: RolesEnum.USER, icon: FaUser, color: "#fec223" },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-4">
      {userCountData.map((item, index) => (
        <UserCountCard
          key={index}
          count={item.count}
          role={item.role}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </div>
  );
};

export default UserCountSection;
