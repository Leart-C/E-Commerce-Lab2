import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { FaList } from "react-icons/fa6";
import { FaListCheck } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";
import { FaUserShield } from "react-icons/fa6";
import { FaUserLarge } from "react-icons/fa6";
import { MdOutlinePayment } from "react-icons/md";
import { MdOutlinePayments } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { GrUserManager } from "react-icons/gr";
import { List } from "@mui/material";
import { PATH_DASHBOARD } from "../../routes/paths";
import { PiUserCircleDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const sidebarLinks = [
  {
    label: "User Management",
    href: PATH_DASHBOARD.usersManagement,
    icon: <GrUserManager />,
  },
  {
    label: "All Logs",
    href: PATH_DASHBOARD.systemLogs,
    icon: <FaList />,
  },
  {
    label: "My Logs",
    href: PATH_DASHBOARD.myLogs,
    icon: <FaListCheck />,
  },
  {
    label: "Owner Page",
    href: PATH_DASHBOARD.owner,
    icon: <FaUserTie />,
  },
  {
    label: "Admin Page",
    href: PATH_DASHBOARD.admin,
    icon: <FaUserShield />,
  },
  {
    label: "Manager Page",
    href: PATH_DASHBOARD.manager,
    icon: <FaUserGear />,
  },
  {
    label: "User Page",
    href: PATH_DASHBOARD.user,
    icon: <FaUserLarge />,
  },
  {
    label: "Payments",
    href: PATH_DASHBOARD.payments,
    icon: <MdOutlinePayment />,
  },
  {
    label: "Payment Methods",
    href: PATH_DASHBOARD.paymentMethods,
    icon: <MdOutlinePayments />,
  },
  {
    label: "Invoices",
    href: PATH_DASHBOARD.invoice,
    icon: <FaFileInvoiceDollar />,
  },
  {
    label: "PaymentCrud",
    href: PATH_DASHBOARD.paymentCrud,
    icon: <FaFileInvoiceDollar />,
  },
];

export function AppSidebarList() {
  const navigate = useNavigate();
  return (
    <>
      <List>
        {sidebarLinks.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => navigate(item.href)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
