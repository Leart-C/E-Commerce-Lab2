import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "../../routes/paths";
import "./add-payment.scss";

type FormValues = {
  amount: number;
  date: string;
  status: string;
  invoiceId: string;
  paymentMethodId: string;
};

type Invoice = {
  id: string;
  totalAmount: number;
  dateGenerated: string;
};

type PaymentMethod = {
  id: string;
  type: string;
  details: string;
};

export const statuses = [
  { label: "Active", value: "active" },
  { label: "Declined", value: "declined" },
];

const initialValues = {
  amount: 0,
  date: "",
  status: "",
  invoiceId: "",
  paymentMethodId: "",
};

export const AddPayment = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);
  const [paymentMethodsList, setPaymentMethodsList] = useState<PaymentMethod[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch invoices from the API
  const fetchInvoices = async () => {
    try {
      const res = await axios.get<Invoice[]>(
        "https://localhost:7024/api/Invoice/Get"
      );
      setInvoicesList(res.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError("Error fetching invoices. Please try again.");
    }
  };

  // Fetch payment methods from the API
  const fetchPaymentMethods = async () => {
    try {
      const res = await axios.get<PaymentMethod[]>(
        "https://localhost:7024/api/PaymentMethod/Get"
      );
      setPaymentMethodsList(res.data);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      setError("Error fetching payment methods. Please try again.");
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchPaymentMethods();
  }, []);

  console.log(formValues);

  // Handle form input changes
  const handleInputChange = (
    event:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;

    console.log({ name, value });

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    const { amount, date, status, invoiceId, paymentMethodId } = formValues;

    console.log(formValues);

    return (
      amount > 0 &&
      date.trim() !== "" &&
      status.trim() !== "" &&
      invoiceId &&
      paymentMethodId
    );
  };

  // Add a new payment
  const addNewPayment = async () => {
    try {
      setIsAdding(true);
      setError(null);
      setSuccessMessage(null);

      await axios.post("https://localhost:7024/api/Payment/Create", formValues);

      setSuccessMessage("Payment added successfully!");
      setFormValues(initialValues);
      navigate(PATH_DASHBOARD.payments);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error adding new payment:", error);
      setError(
        error.response?.data?.message ||
          "Error adding new payment. Please try again."
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Box
      className="add-payment-container"
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
              <TableCell colSpan={2} align="center">
                Add New Payment
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error && (
              <TableRow>
                <TableCell
                  className="error-message"
                  colSpan={2}
                  align="center"
                  style={{ color: "red" }}
                >
                  {error}
                </TableCell>
              </TableRow>
            )}
            {successMessage && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  align="center"
                  style={{ color: "green" }}
                  className="success-message"
                >
                  {successMessage}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell className="form-input">
                <TextField
                  name="amount"
                  type="number"
                  onChange={handleInputChange}
                  value={formValues.amount}
                  placeholder="Amount"
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell className="form-input">
                <TextField
                  name="date"
                  type="date"
                  onChange={handleInputChange}
                  value={formValues.date}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell className="form-input">
                <Select
                  name="status"
                  value={formValues.status}
                  onChange={(e) =>
                    handleInputChange(
                      e as { target: { name: string; value: string } }
                    )
                  }
                  fullWidth
                >
                  {statuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Invoice</TableCell>
              <TableCell className="form-input">
                <Select
                  name="invoiceId"
                  value={formValues.invoiceId}
                  onChange={(e) =>
                    handleInputChange(
                      e as { target: { name: string; value: string } }
                    )
                  }
                  fullWidth
                >
                  {invoicesList.map((invoice) => (
                    <MenuItem key={invoice.id} value={invoice.id}>
                      {`Invoice #${invoice.id} - ${invoice.totalAmount} $`}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Payment Method</TableCell>
              <TableCell className="form-input">
                <Select
                  name="paymentMethodId"
                  value={formValues.paymentMethodId}
                  onChange={(e) =>
                    handleInputChange(
                      e as { target: { name: string; value: string } }
                    )
                  }
                  fullWidth
                >
                  {paymentMethodsList.map((method) => (
                    <MenuItem key={method.id} value={method.id}>
                      {method.type}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="action-button" colSpan={2} align="center">
                <Button
                  variant={isAdding ? "outlined" : "contained"}
                  disabled={isAdding || !isFormValid()}
                  onClick={addNewPayment}
                >
                  {isAdding ? "Adding new payment..." : "Add new payment"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddPayment;
