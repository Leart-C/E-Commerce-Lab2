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
import { Paper, Typography } from "@mui/material";

interface Order {
  id: number;
  username: string;
  shippingAddressId: number;
  status: string;
  totalPrice: number;
}

interface StatusCount {
  status: string;
  count: number;
}

const OrderBarChart: React.FC = () => {
  const [data, setData] = useState<StatusCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get<Order[]>("https://localhost:7039/api/Order")
      .then((res) => {
        const orders = res.data;
        const statusCounts: { [key: string]: number } = {};

        orders.forEach((order) => {
          const status = order.status.toLowerCase();
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const chartData = Object.entries(statusCounts).map(
          ([status, count]) => ({
            status,
            count,
          })
        );

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
    <Paper
      elevation={3}
      sx={{
        backgroundColor: "#1e1e2f",
        padding: 2,
        color: "white",
        height: 360,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6" color="white" mb={2}>
        Porositë sipas statusit
      </Typography>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="status" stroke="#ccc" />
          <YAxis allowDecimals={false} stroke="#ccc" />
          <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} />
          <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default OrderBarChart;
