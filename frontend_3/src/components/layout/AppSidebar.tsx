import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { FaBox, FaClipboard, FaComment, FaList } from "react-icons/fa6";
import { FaListCheck } from "react-icons/fa6";
import { FaExchangeAlt, FaTags, FaUndo, FaUserTie } from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";
import { FaUserShield } from "react-icons/fa6";
import { FaUserLarge } from "react-icons/fa6";
import {
  MdLocalShipping,
  MdOutlinePayment,
  MdRateReview,
} from "react-icons/md";
import { MdOutlinePayments } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { GrUserManager } from "react-icons/gr";
import { List } from "@mui/material";
import { PATH_DASHBOARD } from "../../routes/paths";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.hook";
import {
  allAccessRoles,
  managerAccessRoles,
  adminAccessRoles,
  ownerAccessRoles,
} from "../../auth/auth.utils";

export function AppSidebarList() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const getSidebarLinks = () => {
    if (
      isAuthenticated &&
      user?.roles?.some((role) =>
        [
          ...ownerAccessRoles,
          ...adminAccessRoles,
          ...managerAccessRoles,
        ].includes(role)
      )
    ) {
      return [
        {
          label: "Owner Page",
          href: PATH_DASHBOARD.usersManagement,
          icon: <FaUserTie />,
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
          label: "Admin Page",
          href: PATH_DASHBOARD.admin,
          icon: <FaUserShield />,
        },

        {
          label: "User Page",
          href: PATH_DASHBOARD.user,
          icon: <FaUserLarge />,
        },
        {
          label: "Chat Page",
          href: PATH_DASHBOARD.chat,
          icon: <FaComment />,
        },
        {
          label: "Payment",
          href: PATH_DASHBOARD.payment,
          icon: <MdOutlinePayment />,
        },
        {
          label: "Payment Method",
          href: PATH_DASHBOARD.paymentMethod,
          icon: <MdOutlinePayments />,
        },
        {
          label: "Invoice",
          href: PATH_DASHBOARD.invoice,
          icon: <FaFileInvoiceDollar />,
        },
        {
          label: "Category",
          href: PATH_DASHBOARD.category,
          icon: <FaTags />,
        },
        {
          label: "Refund",
          href: PATH_DASHBOARD.refund,
          icon: <FaUndo />,
        },
        {
          label: "Transaction",
          href: PATH_DASHBOARD.transaction,
          icon: <FaExchangeAlt />,
        },
        {
          label: "ShippingAddress",
          href: PATH_DASHBOARD.shippingAddress,
          icon: <MdLocalShipping />,
        },
        { label: "Order", href: PATH_DASHBOARD.order, icon: <FaClipboard /> },
        { label: "Product", href: PATH_DASHBOARD.product, icon: <FaBox /> },
        {
          label: "Product Review",
          href: PATH_DASHBOARD.productReview,
          icon: <MdRateReview />,
        },
        {
          label: "Order Item",
          href: PATH_DASHBOARD.orderItem,
          icon: <FaBox />,
        },
        
      ];
    } else if (
      isAuthenticated &&
      user?.roles?.some((role) => allAccessRoles.includes(role))
    ) {
      return [
        {
          label: "My Logs",
          href: PATH_DASHBOARD.myLogs,
          icon: <FaListCheck />,
        },
        {
          label: "Payment",
          href: PATH_DASHBOARD.payment,
          icon: <MdOutlinePayment />,
        },
        {
          label: "Payment Method",
          href: PATH_DASHBOARD.paymentMethod,
          icon: <MdOutlinePayments />,
        },
        {
          label: "Invoice",
          href: PATH_DASHBOARD.invoice,
          icon: <FaFileInvoiceDollar />,
        },
        {
          label: "User Page",
          href: PATH_DASHBOARD.user,
          icon: <FaUserLarge />,
        },
        {
          label: "Chat Page",
          href: PATH_DASHBOARD.chat,
          icon: <FaComment />,
        },
        {
          label: "Refund",
          href: PATH_DASHBOARD.refund,
          icon: <FaUndo />,
        },
        {
          label: "Transaction",
          href: PATH_DASHBOARD.transaction,
          icon: <FaExchangeAlt />,
        },
        {
          label: "ShippingAddress",
          href: PATH_DASHBOARD.shippingAddress,
          icon: <MdLocalShipping />,
        },

        {
          label: "Category",
          href: PATH_DASHBOARD.category,
          icon: <FaTags />,
        },
        { label: "Order", href: PATH_DASHBOARD.order, icon: <FaClipboard /> },
        { label: "Product", href: PATH_DASHBOARD.product, icon: <FaBox /> },
        {
          label: "Product Review",
          href: PATH_DASHBOARD.productReview,
          icon: <MdRateReview />,
        },
        {
          label: "Order Item",
          href: PATH_DASHBOARD.orderItem,
          icon: <FaBox />,
        },
        
      ];
    } else {
      return [];
    }
  };

  const sidebarLinks = getSidebarLinks();

  return (
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
  );
}
