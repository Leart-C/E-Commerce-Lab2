import { useEffect, useState } from "react";
import { ISupplier } from "../../types/global.typing";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@mui/material";

const baseUrl = "https://localhost:7149/api/Supplier/";

const EditSupplier = () => {
  const [supplier, setSupplier] = useState<Partial<ISupplier>>({
    name: "",
    info: "",
  });
  const redirect = useNavigate();
  const { id } = useParams();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSupplier({
      ...supplier,
      [event.target.name]: event.target.value,
    });
  };

  const handleDefaultValues = (values: ISupplier) => {
    setSupplier({
      name: values.name,
      info: values.info,
    });
  };

  const getSupplierById = async () => {
    await axios.get<ISupplier>(`${baseUrl}${id}`).then((res) => {
      const { data } = res;
      handleDefaultValues(data);
    });
  };

  useEffect(() => {
    if (id) {
      getSupplierById();
    }
  }, [id]);

  const handleSaveBtnClick = () => {
    if (supplier.name === "" || supplier.info === "") {
      alert("FIll");
      return;
    }
    axios
      .put(baseUrl + id, supplier)
      .then(() =>
        redirect("/suppliers", {
          state: { message: "Supplier updated successfully" },
        })
      )
      .catch(() => alert("Error"));
  };

  const handleBackBtnClick = () => {
    redirect("/suppliers");
  };

  return (
    <div className="edit-product">
      <h2>Edit Suppliers</h2>
      <TextField
        autoComplete="off"
        label="Name"
        variant="outlined"
        name="name"
        value={supplier.name}
        onChange={changeHandler}
      />
      <TextField
        autoComplete="off"
        label="Info"
        variant="outlined"
        name="info"
        value={supplier.info}
        onChange={changeHandler}
      />

      <div>
        <Button variant="outlined" color="primary" onClick={handleSaveBtnClick}>
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
  );
};

export default EditSupplier;
