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

type PaymentMethod = {
  id: string;
  type: string;
  details: string;
};

const BASE_URL = "https://localhost:7024/api/PaymentMethod/Create"; // Adjust to your API

const AddPaymentMethod: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState<Partial<PaymentMethod>>({
    type: "",
    details: "",
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

  const addNewPaymentMethod = async () => {
    try {
      setIsAdding(true);
      await axios.post(BASE_URL, formValues);
      setIsAdding(false);
      navigate(-1); // Redirect to the paymentMethods list page
    } catch (error) {
      console.log("Error adding new payment method:", error);
    }
  };

  return (
    <Box
      className="add-payment-method-container"
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
        className="add-payment-method-table"
        component={Paper}
        sx={{ maxWidth: 600 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header" colSpan={2} align="center">
                Add New Payment Method
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className="table-row">
              <TableCell className="table-cell">Type</TableCell>
              <TableCell>
                <TextField
                  name="type"
                  value={formValues.type || ""}
                  onChange={handleInputChange}
                  placeholder="Payment Type"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow className="table-row">
              <TableCell className="table-cell">Details</TableCell>
              <TableCell>
                <TextField
                  name="details"
                  value={formValues.details || ""}
                  onChange={handleInputChange}
                  placeholder="Payment Details"
                  fullWidth
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2} align="center">
                <Button
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding}
                  onClick={addNewPaymentMethod}
                  className="add-payment-method-button"
                >
                  {isAdding
                    ? "Adding new payment method..."
                    : "Add new payment method"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddPaymentMethod;
