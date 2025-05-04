import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Janar", porosi: 400 },
  { name: "Shkurt", porosi: 300 },
  { name: "Mars", porosi: 200 },
  { name: "Prill", porosi: 278 },
  { name: "Maj", porosi: 189 },
];

export default function BasicBarChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="porosi" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
