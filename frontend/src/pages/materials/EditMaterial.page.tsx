import Gani from "react";
import { IMaterial, IProduct } from "../../types/global.typing";
import "./materials.scss";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import axios from "axios";

const EditMaterial: React.FC = () => {
  const [material, setMaterial] = Gani.useState<Partial<IMaterial>>({
    name: "",
    description: "",
  });

  const redirect = useNavigate();
  const { id } = useParams();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaterial({
      ...material,
      [event.target.name]: event.target.value,
    });
  };

  const getMaterialById = async () => {
    await axios
      .get<IMaterial>(`https://localhost:7149/api/Material/${id}`)
      .then((res) => {
        const { data } = res;
        setMaterial({
          name: data.name,
          description: data.description,
        });
      });
  };

  Gani.useEffect(() => {
    if (id) {
      getMaterialById();
    }
  }, [id]);

  const handleSaveBtnClick = () => {
    if (material.name === "" || material.description === "") {
      alert("Enter Values");
      return;
    }
    const data: Partial<IMaterial> = {
      name: material.name,
      description: material.description,
    };
    axios
      .put(`https://localhost:7149/api/Material/${id}`, data)
      .then(() =>
        redirect("/materials", {
          state: { message: "Material Updated Successfully" },
        })
      )
      .catch(() => alert("Error"));
  };

  const handleBackBtnClick = () => {
    redirect("/materials");
  };

  return (
    <div className="edit-material">
      <div className="edit-material-content">
        <h2>Edit Materials</h2>
        <div className="form">
          <TextField
            autoComplete="off"
            label="Name"
            variant="outlined"
            name="name"
            value={material.name}
            onChange={changeHandler}
          />
          <TextField
            autoComplete="off"
            label="Description"
            variant="outlined"
            name="description"
            value={material.description}
            onChange={changeHandler}
          />
        </div>

        <div className="buttonContainer">
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

export default EditMaterial;
