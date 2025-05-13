import { useState, useEffect } from "react";
import axios from "axios";
// import { IPaymentMethod } from "../../types/paymentMethod.types"; // adjust path if needed
import {
  Box,
  Button,
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
  DialogTitle,
  DialogContentText,
  Stack,
} from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { PATH_DASHBOARD } from "../../routes/paths";

type PaymentMethod = {
  id: string;
  type: string;
  details: string;
};

const PaymentMethods: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethodID, setSelectedPaymentMethodID] = useState<
    string | null
  >(null);
  const [openDialog, setOpenDialog] = useState(false);

  const baseUrl = "https://localhost:7024/api/PaymentMethod/Get"; // replace with your actual URL
  const deleteURL = "https://localhost:7024/api/PaymentMethod"; // replace with your actual URL

  const location = useLocation();
  const redirect = useNavigate();

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get<PaymentMethod[]>(baseUrl);
      setPaymentMethods(response.data);
      if (location?.state) {
        Swal.fire({
          icon: "success",
          title: location?.state?.message,
        });
        redirect(location.pathname, { replace: true });
      }
    } catch (error) {
      alert("An error occurred while fetching payment methods.");
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedPaymentMethodID(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPaymentMethodID(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPaymentMethodID) {
      try {
        await axios.delete(`${deleteURL}/${selectedPaymentMethodID}`);
        setPaymentMethods((prevMethods) =>
          prevMethods.filter((method) => method.id !== selectedPaymentMethodID)
        );
      } catch (error) {
        console.error("Failed to delete payment method:", error);
      } finally {
        handleCloseDialog();
      }
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return (
    <Box className="payment-methods-container" sx={{ padding: 2 }}>
      <Stack direction="column" spacing={2}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => redirect(`${PATH_DASHBOARD.paymentMethods}/add`)}
          sx={{ alignSelf: "flex-end" }}
          className="add-payment-button"
        >
          Add New Payment Method
        </Button>

        <TableContainer className="table-container" component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="table-cell">ID</TableCell>
                <TableCell className="table-cell">Type</TableCell>
                <TableCell className="table-cell">Details</TableCell>
                <TableCell className="table-cell">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentMethods.map((method) => {
                return (
                  <TableRow key={method.id}>
                    <TableCell className="table-cell">{method.id}</TableCell>
                    <TableCell className="table-cell">{method.type}</TableCell>
                    <TableCell className="table-cell">
                      {method.details}
                    </TableCell>
                    <TableCell className="table-cell">
                      <Link
                        to={`${PATH_DASHBOARD.paymentMethods}/edit/${method.id}`}
                      >
                        <Button className="edit-button" size="small">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="small"
                        onClick={() => handleDeleteClick(method.id)}
                        className="delete-button"
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

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle className="dialog-title">
            Delete Payment Method
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this payment method? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button
              className="dialog-cancel-button"
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
            <Button
              className="dialog-confirm-button"
              onClick={handleDeleteConfirm}
              color="secondary"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default PaymentMethods;
