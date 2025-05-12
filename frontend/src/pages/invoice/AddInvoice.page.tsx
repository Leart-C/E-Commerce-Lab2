import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import { PATH_DASHBOARD } from "../../routes/paths";

type Invoice = {
  id: string;
  dateGenerated: string;
  totalAmount: number;
};

const BASE_URL = "https://localhost:7024/api/Invoice/Create"; // Adjust to your API

const AddInvoice: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState<Partial<Invoice>>({
    dateGenerated: "",
    totalAmount: 0,
  });

  const navigate = useNavigate();

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const addNewInvoice = async () => {
    try {
      setIsAdding(true);
      await axios.post(BASE_URL, formValues);
      setIsAdding(false);
      navigate(PATH_DASHBOARD.invoice); // Redirect to the invoices list page
    } catch (error) {
      console.log("Error adding new invoice:", error);
    }
  };

  return (
    <Box
      className="add-invoice-container"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        padding: 2,
      }}
    >
      <TableContainer
        className="table-container"
        component={Paper}
        sx={{ maxWidth: 600 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header" colSpan={2} align="center">
                Add New Invoice
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Date Generated</TableCell>
              <TableCell>
                <TextField
                  name="dateGenerated"
                  value={formValues.dateGenerated || ""}
                  onChange={handleInputChange}
                  placeholder="Date Generated"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className="text-field"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Amount</TableCell>
              <TableCell>
                <TextField
                  name="totalAmount"
                  value={formValues.totalAmount || ""}
                  onChange={handleInputChange}
                  placeholder="Total Amount"
                  type="number"
                  fullWidth
                  className="text-field"
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2} align="center">
                <Button
                  className="add-invoice-button"
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding}
                  onClick={addNewInvoice}
                >
                  {isAdding ? "Adding new invoice..." : "Add new invoice"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddInvoice;
