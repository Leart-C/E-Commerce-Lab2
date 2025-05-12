import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid/models";
import moment from "moment";
import { IProduct } from "../../types/global.typing";

const column: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "name", headerName: "Naem", width: 200 },
  { field: "size", headerName: "Size", width: 150 },
  {
    field: "createdAt",
    headerName: "Creation Time",
    width: 200,
    renderCell: (params) => moment(params.row.createdAt).format("YYYY-MM-DD"),
  },
];

interface IProductGridProps {
  data: IProduct[];
}

const ProductGrid = ({ data }: IProductGridProps) => {
  return (
    <Box className="companies-gridd">
      <DataGrid rows={data} columns={column} />
    </Box>
  );
};

export default ProductGrid;
