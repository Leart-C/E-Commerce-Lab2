import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import axios from "axios";

// Ngjyrat për kategoritë
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#9933FF",
  "#FF4444",
];

// Label i personalizuar për pozicionim jashtë rrethit
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const labelText = `${name}: ${(percent * 100).toFixed(0)}%`;
  const shortLabel =
    labelText.length > 20 ? labelText.slice(0, 19) + "…" : labelText;

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      style={{ maxWidth: 120, whiteSpace: "nowrap" }}
    >
      {shortLabel}
    </text>
  );
};

const ProductCategoryPieChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("https://localhost:7039/api/Product"),
          axios.get("https://localhost:7039/api/Category"),
        ]);

        const categoryCount: { [key: string]: number } = {};

        productsRes.data.forEach((product: any) => {
          const categoryId = product.categoryId;
          categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1;
        });

        const chartData = categoriesRes.data
          .map((cat: any) => {
            const name =
              cat.name ||
              cat.title ||
              cat.categoryName ||
              `Kategoria ${cat.id}`;
            return {
              name,
              value: categoryCount[cat.id] || 0,
            };
          })
          .filter((item) => item.value > 0);

        setData(chartData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading chart data", err);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Card
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
      <CardContent>
        <Typography variant="h6" gutterBottom color="white">
          Produktet sipas kategorisë
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={90}
              dataKey="value"
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#333",
                border: "none",
                color: "#fff",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProductCategoryPieChart;
