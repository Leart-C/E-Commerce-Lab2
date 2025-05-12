import { Button } from "@mui/material";
import axios from "axios";
import "./deleteOrder.scss";
import { useNavigate, useParams } from "react-router-dom";

const DeleteOrder = () => {
  const redirect = useNavigate();
  const { id } = useParams();

  const handleDeleteBtnClick = () => {
    axios
      .delete(`https://localhost:7149/api/Delete/${id}`)
      .then(() =>
        redirect("/orders", {
          state: { message: "Order Deleted Successfully" },
        })
      )
      .catch(() => alert("Error"));
  };

  const handleBackBtnClick = () => {
    redirect("/orders");
  };

  return (
    <div className="delete-product">
      <h2>Delete Product</h2>
      <h4>Are you sure you want to delete this product?</h4>

      <div>
        <Button variant="outlined" color="error" onClick={handleDeleteBtnClick}>
          Yes,Delete
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
  );
};

export default DeleteOrder;
