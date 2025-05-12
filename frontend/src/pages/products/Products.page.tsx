import { useState, useEffect } from "react";
import "./products.scss";
import axios from "axios";
import { baseUrl } from "../../routes/paths";
import { IProduct } from "../../types/global.typing";
import { Button } from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { RolesEnum } from "../../types/auth.types"; // Adjust the import path if necessary
import useAuth from "../../hooks/useAuth.hook";

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const location = useLocation();
  const redirect = useNavigate();
  const { user } = useAuth();

  const fetchProductsList = async () => {
    try {
      const response = await axios.get<IProduct[]>(baseUrl);
      setProducts(response.data);
      if (location?.state) {
        Swal.fire({
          icon: "success",
          title: location?.state?.message,
        });
        redirect(location.pathname, { replace: true });
      }
    } catch (error) {
      alert("An Error Happened");
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const redirectToEditPage = (id: string) => {
    redirect(`/products/edit/${id}`);
  };

  const redirectToDeletePage = (id: string) => {
    redirect(`/products/delete/${id}`);
  };

  const isAuthorizedToEditDelete = [
    RolesEnum.OWNER,
    RolesEnum.ADMIN,
    RolesEnum.MANAGER,
  ];
  const hasPermission = user?.roles.some((role) =>
    isAuthorizedToEditDelete.includes(role)
  );

  return (
    <div className="products">
      <h1>Products List</h1>
      {hasPermission && (
        <Button variant="outlined" onClick={() => redirect("/products/add")}>
          <Add />
        </Button>
      )}

      {products.length === 0 ? (
        <h1>No Products</h1>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Brand</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>{product.brand}</td>

                  {/* <td>{product.size}</td> */}
                  <td>
                    {hasPermission && (
                      <>
                        <Button
                          variant="outlined"
                          color="warning"
                          sx={{ mx: 3 }}
                          onClick={() => redirectToEditPage(product.id)}
                        >
                          <Edit />
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => redirectToDeletePage(product.id)}
                        >
                          <Delete />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;
