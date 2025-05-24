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

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#9933FF",
  "#FF4444",
];

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

        console.log("Categories:", categoriesRes.data);
        console.log("Products:", productsRes.data);

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
    <Card sx={{ width: "100%", height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Produktet sipas kategorisë
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProductCategoryPieChart;
