import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import dayjs from "dayjs";

interface Order {
  id: number;
  orderDate: string;
  // mund të ketë edhe fusha të tjera që nuk i përdorim këtu
}

interface MonthlyOrder {
  month: string;
  totalOrders: number;
}

const OrderBarChart: React.FC = () => {
  const [data, setData] = useState<MonthlyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get<Order[]>("https://localhost:7039/api/Order")
      .then((res) => {
        const orders = res.data;
        const monthlyCounts: { [month: string]: number } = {};

        orders.forEach((order) => {
          const month = dayjs(order.orderDate).format("MMMM");
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });

        const chartData = Object.entries(monthlyCounts).map(([month, totalOrders]) => ({
          month,
          totalOrders,
        }));

        setData(chartData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading orders:", err);
        setError("Failed to load order data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="totalOrders" fill="#1976d2" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OrderBarChart;
