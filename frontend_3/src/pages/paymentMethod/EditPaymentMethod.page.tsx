import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import "./edit-paymentMethod.scss";

type PaymentMethod = {
  id: string;
  type: string;
  details: string;
};

const EditPaymentMethod: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<Partial<PaymentMethod>>({
    type: "",
    details: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  // Function to handle input change
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod({
      ...paymentMethod,
      [event.target.name]: event.target.value,
    });
  };

  // Function to fetch payment method by ID
  const getPaymentMethodById = async () => {
    try {
      const response = await axios.get<PaymentMethod>(
        `https://localhost:7024/api/PaymentMethod/${id}`
      );
      const { data } = response;
      setPaymentMethod({
        type: data.type,
        details: data.details,
      });
    } catch (error) {
      console.error("Error fetching payment method:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue fetching the payment method details.",
        confirmButtonText: "OK",
      });
    }
  };

  // Fetch payment method details when component is mounted
  useEffect(() => {
    if (id) {
      getPaymentMethodById();
    }
  }, [id]);

  // Function to handle saving the edited payment method
  const handleSaveBtnClick = async () => {
    if (paymentMethod.type === "" || paymentMethod.details === "") {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fill in all fields.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const data: Partial<PaymentMethod> = {
        type: paymentMethod.type,
        details: paymentMethod.details,
      };
      await axios.put(`https://localhost:7024/api/PaymentMethod/${id}`, data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Payment method updated successfully.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error("Error saving payment method:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an issue updating the payment method.",
        confirmButtonText: "OK",
      });
    }
  };

  // Function to navigate back
  const handleBackBtnClick = () => {
    navigate(-1);
  };

  return (
    <div className="edit-payment-method">
      <div className="edit-payment-method-content">
        <h2>Edit Payment Method</h2>
        <div className="form">
          <TextField
            autoComplete="off"
            label="Type"
            variant="outlined"
            name="type"
            value={paymentMethod.type}
            onChange={changeHandler}
            fullWidth
          />
          <TextField
            autoComplete="off"
            label="Details"
            variant="outlined"
            name="details"
            value={paymentMethod.details}
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

export default EditPaymentMethod;
