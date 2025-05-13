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

const API_BASE_URL = "https://localhost:7024/api";

// Define the types
export type Invoice = {
  id: string;
  dateGenerated: string;
  totalAmount: number;
};

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );

  const redirect = useNavigate();

  // Fetch data from APIs
  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Invoice/Get`);
      setInvoices(res.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  // Delete invoice
  const handleDeleteClick = (id: string) => {
    setSelectedInvoiceId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInvoiceId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedInvoiceId) {
      try {
        await axios.delete(`${API_BASE_URL}/Invoice/${selectedInvoiceId}`);
        setInvoices(
          (prev) =>
            prev?.filter((invoice) => invoice.id !== selectedInvoiceId) || null
        );
      } catch (error) {
        console.error("Error deleting invoice:", error);
      } finally {
        handleClose();
      }
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <Box className="invoices-container" sx={{ padding: 2 }}>
      <Stack direction="column" spacing={2}>
        <Button
          className="add-invoice-button"
          variant="outlined"
          onClick={() => redirect(`${PATH_DASHBOARD.invoice}/add`)}
        >
          Add New Invoice
        </Button>
        <TableContainer className="table-container" component={Paper}>
          <Table>
            <TableHead className="table-header">
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date Generated</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices?.map((invoice) => (
                <TableRow className="table-row" key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.dateGenerated}</TableCell>
                  <TableCell>{invoice.totalAmount}</TableCell>
                  <TableCell className="button-container">
                    <Link to={`${PATH_DASHBOARD.invoice}/edit/${invoice.id}`}>
                      <Button className="edit-button" size="small">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="small"
                      onClick={() => handleDeleteClick(invoice.id)}
                      className="delete-button"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog className="delete-dialog" open={open} onClose={handleClose}>
          <DialogTitle>Delete Invoice</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this invoice? This action cannot
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

export default Invoices;
