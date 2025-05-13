import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "../../routes/paths";
import { format } from "date-fns";

const API_BASE_URL = "https://localhost:7024/api";

// Define the types
export type Payment = {
  id: string;
  amount: number;
  date: string;
  status: string;
  paymentMethodId: string;
  invoiceId: string;
};

export type Invoice = {
  id: string;
  dateGenerated: string;
  totalAmount: number;
};

export type PaymentMethod = {
  id: string;
  type: string;
  details: string;
};

const Payments = () => {
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );

  const redirect = useNavigate();

  // Fetch data from APIs
  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Payment/Get`);
      setPayments(res.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Invoice/Get`);
      setInvoices(res.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/PaymentMethod/Get`);
      setPaymentMethods(res.data);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  // Delete payment
  const handleDeleteClick = (id: string) => {
    setSelectedPaymentId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPaymentId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPaymentId) {
      try {
        await axios.delete(`${API_BASE_URL}/Payment/${selectedPaymentId}`);
        setPayments(
          (prev) => prev?.filter((p) => p.id !== selectedPaymentId) || null
        );
      } catch (error) {
        console.error("Error deleting payment:", error);
      } finally {
        handleClose();
      }
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchInvoices();
    fetchPaymentMethods();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Stack direction="column" spacing={2}>
        <Button
          className="add-payment-button"
          variant="outlined"
          onClick={() => redirect(`${PATH_DASHBOARD.payments}/add`)}
        >
          Add New Payment
        </Button>
        <TableContainer className="table-container" component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Invoice</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments?.map((payment) => {
                const invoice = invoices.find(
                  (invoice) => invoice.id === payment.invoiceId
                );

                const invoiceDateGenerated = invoice?.dateGenerated;

                return (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>
                      {payment.date
                        ? format(new Date(payment.date), "dd-MM-yyyy")
                        : ""}
                    </TableCell>
                    <TableCell>{payment.status}</TableCell>
                    <TableCell>
                      {invoiceDateGenerated
                        ? format(
                            new Date(invoiceDateGenerated),
                            "dd-MM-yyyy HH:mm"
                          )
                        : "Unknown"}
                    </TableCell>

                    <TableCell>
                      {paymentMethods.find(
                        (method) => method.id === payment.paymentMethodId
                      )?.type || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`${PATH_DASHBOARD.payments}/edit/${payment.id}`}
                      >
                        <Button className="edit-button" size="small">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        className="delete-button"
                        size="small"
                        onClick={() => handleDeleteClick(payment.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog className="delete-dialog" open={open} onClose={handleClose}>
          <DialogTitle>Delete Payment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this payment? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default Payments;
