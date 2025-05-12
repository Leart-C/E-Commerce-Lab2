import { useState } from "react";
import "./add-products.scss";
import { ICreateProduct } from "../../types/global.typing";
import {} from "@mui/material";
import TextField from "@mui/material/TextField/TextField";
import FormControl from "@mui/material/FormControl/FormControl";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import Select from "@mui/material/Select/Select";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Button from "@mui/material/Button/Button";
import { useNavigate } from "react-router-dom";
import httpModule from "../../helpers/http.module";

const AddCompany = () => {
  const [product, setProduct] = useState<ICreateProduct>({
    brand: "",
    size: "",
    title: "",
  });
  const redirect = useNavigate();

  const handleClickSaveBtn = () => {
    if (product.brand === "" || product.size === "") {
      alert("Fill all fields");
      return;
    }
    httpModule
      .post("https://localhost:7149/api/Product/Create", product)
      // problem
      .then(() => redirect("/products"))
      .catch((error) => console.log(error));
  };

  const handleClickBackBtn = () => {
    redirect("/products");
  };

  return (
    <div className="products">
      <div className="add-product">
        <h2>Add New Product</h2>

        <TextField
          autoComplete="off"
          label="Title"
          variant="outlined"
          value={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
        />
        <TextField
          autoComplete="off"
          label="Company Name"
          variant="outlined"
          value={product.brand}
          onChange={(e) => setProduct({ ...product, brand: e.target.value })}
        />

        <FormControl fullWidth>
          <InputLabel>Company Size</InputLabel>
          <Select
            value={product.size}
            label="Company Size"
            onChange={(e) => setProduct({ ...product, size: e.target.value })}
          >
            <MenuItem value="Small">Small</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Large">Large</MenuItem>
          </Select>
        </FormControl>
        <div className="btns">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClickSaveBtn}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClickBackBtn}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCompany;
