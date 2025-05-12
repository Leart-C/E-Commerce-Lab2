import React from "react";
import { IOrder } from "../../types/global.typing";
import "./editOrder.scss";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import axios from "axios";

const EditOrders: React.FC = () => {
  const [order, setOrder] = React.useState<Partial<IOrder>>({
    total: "",
    address: "",
    paymentMethod: "",
  });

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrder({
      ...order,
      [event.target.name]: event.target.value,
    });
  };

  const getOrderById = async () => {
    await axios
      .get<IOrder>(`https://localhost:7149/api/Orders/${id}`)
      .then((res) => {
        const { data } = res;
        setOrder({
          total: data.total,
          address: data.address,
          paymentMethod: data.paymentMethod,
          brand: data.brand,
        });
      });
  };

  React.useEffect(() => {
    if (id) {
      getOrderById();
    }
  }, [id]);

  const handleSaveBtnClick = () => {
    if (
      order.total === "" ||
      order.address === "" ||
      order.paymentMethod === "" ||
      order.brand === ""
    ) {
      alert("Enter Values");
      return;
    }
    const data: Partial<IOrder> = {
      total: order.total,
      address: order.address,
      paymentMethod: order.paymentMethod,
      brand: order.brand,
    };
    axios
      .put(`https://localhost:7149/api/Orders/${id}`, data)
      .then(() =>
        navigate("/orders", {
          state: { message: "Order Updated Successfully" },
        })
      )
      .catch(() => alert("Error"));
  };

  const handleBackBtnClick = () => {
    navigate("/orders");
  };

  return (
    <div className="edit-order-container">
      <div className="edit-order">
        <h2>Edit Order</h2>

        <TextField
          autoComplete="off"
          label="Total"
          variant="outlined"
          name="total"
          type="number"
          value={order.total}
          onChange={changeHandler}
        />
        <TextField
          autoComplete="off"
          label="Address"
          variant="outlined"
          name="address"
          value={order.address}
          onChange={changeHandler}
        />
        <TextField
          autoComplete="off"
          label="Payment Method"
          variant="outlined"
          name="paymentMethod"
          value={order.paymentMethod}
          onChange={changeHandler}
        />

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

export default EditOrders;
