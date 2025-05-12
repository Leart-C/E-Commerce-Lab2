import { useEffect, useState } from "react";
import { IProject } from "../../types/global.typing";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@mui/material";

const baseUrl = "https://localhost:7149/api/Project";

const EditProject = () => {
  const [projects, setProjects] = useState<Partial<IProject>>({
    projectName: "",
    projectManager: "",
    status: "",
  });
  const redirect = useNavigate();
  const { id } = useParams();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjects({
      ...projects,
      [event.target.name]: event.target.value,
    });
  };

  const handleDefaultValues = (values: IProject) => {
    setProjects({
      projectName: values.projectName,
      projectManager: values.projectManager,
      status: values.status,
    });
  };

  const getProjectById = async () => {
    await axios.get<IProject>(`${baseUrl}/${id}`).then((res) => {
      const { data } = res;
      handleDefaultValues(data);
    });
  };

  useEffect(() => {
    if (id) {
      getProjectById();
    }
  }, [id]);

  const handleSaveBtnClick = () => {
    if (
      projects.projectName === "" ||
      projects.projectManager === "" ||
      projects.status
    ) {
      alert("FIll");
      return;
    }
    axios
      .put(baseUrl + id, projects)
      .then(() =>
        redirect("/projects", {
          state: { message: "Projects updated successfully" },
        })
      )
      .catch(() => alert("Error"));
  };

  const handleBackBtnClick = () => {
    redirect("/projects");
  };

  return (
    <div className="edit-product">
      <h2>Edit Suppliers</h2>
      <TextField
        autoComplete="off"
        label="ProjectName"
        variant="outlined"
        name="projectName"
        value={projects.projectName}
        onChange={changeHandler}
      />
      <TextField
        autoComplete="off"
        label="ProjectManager"
        variant="outlined"
        name="projectManager"
        value={projects.projectManager}
        onChange={changeHandler}
      />
      <TextField
        autoComplete="off"
        label="Status"
        variant="outlined"
        name="status"
        value={projects.status}
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

export default EditProject;
