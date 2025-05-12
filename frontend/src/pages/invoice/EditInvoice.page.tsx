import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { PATH_DASHBOARD } from "../../routes/paths";
import { format } from "date-fns";
import "./editInvoice.scss";

type Invoice = {
  id: string;
  dateGenerated: string;
  totalAmount: string;
};

const EditInvoice: React.FC = () => {
  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    dateGenerated: "",
    totalAmount: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  // Function to handle input change
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice({
      ...invoice,
      [event.target.name]: event.target.value,
    });
  };

  // Function to fetch invoice by ID
  const getInvoiceById = async () => {
    try {
      const response = await axios.get<Invoice>(
        `https://localhost:7024/api/Invoice/${id}`
      );
      const { data } = response;
      setInvoice({
        dateGenerated: data.dateGenerated,
        totalAmount: data.totalAmount,
      });
    } catch (error) {
      console.error("Error fetching invoice:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue fetching the invoice details.",
        confirmButtonText: "OK",
      });
    }
  };

  // Fetch invoice details when component is mounted
  useEffect(() => {
    if (id) {
      getInvoiceById();
    }
  }, [id]);

  // Function to handle saving the edited invoice
  const handleSaveBtnClick = async () => {
    if (invoice.dateGenerated === "" || invoice.totalAmount === "") {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fill in all fields with valid data.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const data: Partial<Invoice> = {
        dateGenerated: invoice.dateGenerated,
        totalAmount: invoice.totalAmount,
      };
      await axios.put(`https://localhost:7024/api/Invoice/${id}`, data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Invoice updated successfully.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(PATH_DASHBOARD.invoice, {
          state: { message: "Invoice Updated Successfully" },
        });
      });
    } catch (error) {
      console.error("Error saving invoice:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue updating the invoice.",
        confirmButtonText: "OK",
      });
    }
  };

  // Function to navigate back
  const handleBackBtnClick = () => {
    navigate(PATH_DASHBOARD.invoice);
  };

  return (
    <div className="edit-invoice">
      <div className="edit-invoice-content">
        <h2>Edit Invoice</h2>
        <div className="form">
          <TextField
            disabled
            autoComplete="off"
            label="Date Generated"
            variant="outlined"
            name="dateGenerated"
            value={
              invoice.dateGenerated
                ? format(new Date(invoice.dateGenerated), "dd-MM-yyyy")
                : ""
            }
            onChange={changeHandler}
            fullWidth
          />
          <TextField
            autoComplete="off"
            label="Total Amount"
            variant="outlined"
            name="totalAmount"
            type="number"
            value={invoice.totalAmount}
            onChange={changeHandler}
            fullWidth
          />
        </div>

        <div className="button-container">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSaveBtnClick}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleBackBtnClick}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditInvoice;
