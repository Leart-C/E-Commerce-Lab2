import { Box, Paper, Typography } from "@mui/material";
import { IconType } from "react-icons";

interface DashboardStatBoxProps {
  title: string;
  value: number | string;
  icon: IconType;
  color?: string;
}

const DashboardStatBox = ({
  title,
  value,
  icon: Icon,
  color = "#2196f3",
}: DashboardStatBoxProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        width: 220,
        height: 100,
        backgroundColor: "#1e1e2f",
        color: "white",
      }}
    >
      <Box>
        <Typography variant="body2">{title}</Typography>
        <Typography variant="h6">{value}</Typography>
      </Box>
      <Box sx={{ fontSize: 30, color }}>
        <Icon />
      </Box>
    </Paper>
  );
};

export default DashboardStatBox;