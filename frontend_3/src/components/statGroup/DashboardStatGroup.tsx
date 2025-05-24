import { Box } from "@mui/material";
import { BsCartCheck, BsBoxSeam, BsCurrencyDollar, BsPerson, BsArrowRepeat } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardStatBox from "./DashboardStatBox ";

const DashboardStatGroup = () => {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    payments: 0,
    users: 0,
    refunds: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orders, products, payments, users, refunds] = await Promise.all([
          axios.get("https://localhost:7039/api/Order"),
          axios.get("https://localhost:7039/api/Product"),
          axios.get("https://localhost:7039/api/Payment"),
          axios.get("https://localhost:7039/api/Auth/users"),
          axios.get("https://localhost:7039/api/Refund"),
        ]);

        setStats({
          orders: orders.data.length,
          products: products.data.length,
          payments: payments.data.length,
          users: users.data.length,
          refunds: refunds.data.length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box display="flex" flexWrap="wrap" gap={3} justifyContent="flex-start" mb={4}>
      <DashboardStatBox title="Porosi" value={stats.orders} icon={BsCartCheck} color="#4caf50" />
      <DashboardStatBox title="Produkte" value={stats.products} icon={BsBoxSeam} color="#2196f3" />
      <DashboardStatBox title="Pagesa" value={stats.payments} icon={BsCurrencyDollar} color="#ff9800" />
      <DashboardStatBox title="Përdorues" value={stats.users} icon={BsPerson} color="#9c27b0" />
      <DashboardStatBox title="Rimbursime" value={stats.refunds} icon={BsArrowRepeat} color="#f44336" />
    </Box>
  );
};

export default DashboardStatGroup;