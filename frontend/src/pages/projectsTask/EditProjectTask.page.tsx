import { useEffect, useState } from "react";
import { IProjectTask } from "../../types/global.typing";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@mui/material";

const EditProjectTask = () => {
  const [projectTask, setProjectTask] = useState<Partial<IProjectTask>>({
    status: "",
    description: "",
    taskName: "",
  });

  const redirect = useNavigate();
  const { id } = useParams();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectTask({
      ...projectTask,
      [event.target.name]: event.target.value,
    });
  };

  const getProjectTaskById = async () => {
    await axios
      .get<IProjectTask>(`https://localhost:7149/api/ProjectTask/${id}`)
      .then((res) => {
        const { data } = res;
        setProjectTask({
          status: data.status,
          description: data.description,
          taskName: data.taskName,
        });
      });
  };

  useEffect(() => {
    if (id) {
      getProjectTaskById();
    }
  }, [id]);

  const handleSaveBtnClick = () => {
    if (
      projectTask.description === "" ||
      projectTask.status === "" ||
      projectTask.taskName === ""
    ) {
      alert("Enter Values");
      return;
    }
    const data: Partial<IProjectTask> = {
      status: projectTask.status,
      description: projectTask.description,
      taskName: projectTask.taskName,
    };
    console.log("Sending data:", data);
    axios
      .put(`https://localhost:7149/api/ProjectTask/${id}`, data)
      .then(() =>
        redirect("/projectTasks", {
          state: { message: "Project Task Updated Successfully" },
        })
      )
      .catch(() => alert("Error"));
  };

  const handleBackBtnClick = () => {
    redirect("/projectTasks");
  };
  return (
    <div className="edit-product">
      <h2>Edit ProjectTask</h2>

      <TextField
        autoComplete="off"
        label="Status"
        variant="outlined"
        name="status"
        value={projectTask.status}
        onChange={changeHandler}
      />
      <TextField
        autoComplete="off"
        label="Description"
        variant="outlined"
        name="description"
        value={projectTask.description}
        onChange={changeHandler}
      />
      <TextField
        autoComplete="off"
        label="TaskName"
        variant="outlined"
        name="taskName"
        value={projectTask.taskName}
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

export default EditProjectTask;
