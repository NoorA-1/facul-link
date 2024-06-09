import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  TextField,
  Chip,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { adminEditEmployerValidationSchema } from "../../schemas";
import http from "../../utils/http";
import { AdminEmployerForm, EmployerEditProfileForm } from "../../components";

export const loader = async () => {
  try {
    const { data } = await http.get("/admin/employers");
    return data;
  } catch (error) {
    return null;
  }
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "55%",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  overflowY: "auto",
};

const AdminManageEmployersPage = () => {
  const data = useLoaderData();
  const [tab, setTab] = useState("1");
  const navigate = useNavigate();

  const DataTable = ({ status = null }) => {
    let newData =
      status !== null ? data.filter((data) => data.status === status) : data;
    return (
      <TableContainer
        sx={{ border: "1px solid #0A9396" }}
        className="mb-4"
        component={Paper}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {/* <TableCell className="fw-bold">ID</TableCell> */}
              <TableCell align="left" className="fw-bold">
                Name
              </TableCell>

              <TableCell align="left" className="fw-bold">
                University Name
              </TableCell>
              <TableCell align="left" className="fw-bold">
                Department Name
              </TableCell>
              <TableCell align="left" className="fw-bold">
                Status
              </TableCell>
              <TableCell align="left" className="fw-bold"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newData.length > 0 ? (
              newData.map((e, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  {/* <TableCell component="th" scope="row">
                  {e.userId._id}
                </TableCell> */}
                  <TableCell align="left">
                    {`${e.userId.firstname} ${e.userId.lastname}`}
                    <p className="text-dark-emphasis">{e.userId.email}</p>
                  </TableCell>
                  <TableCell align="left">{e.universityName}</TableCell>

                  <TableCell align="left">{e.departmentName}</TableCell>
                  <TableCell align="left">
                    <Chip
                      className="fw-bold text-capitalize"
                      label={e.status}
                      color={
                        e.status === "active"
                          ? "success"
                          : e.status === "pending"
                          ? "warning"
                          : "error"
                      }
                      variant="contained"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <div className="d-flex justify-content-start ">
                      {e.userId.isProfileSetup && (
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(
                              `/admin-dashboard/employer-profile/${e.userId._id}`
                            )
                          }
                        >
                          <VisibilityOutlinedIcon />
                        </IconButton>
                      )}
                      <IconButton
                        color="secondary"
                        onClick={() => handleOpen("editModal", e.userId._id)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton
                        color="danger"
                        onClick={() =>
                          handleDeleteOpen("deleteModal", e.userId._id)
                        }
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  colSpan="5"
                  style={{ textAlign: "center", padding: 35 }}
                >
                  <FolderOffOutlinedIcon color="disabled" fontSize="large" />
                  <p className="text-secondary">No users found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const handleTab = (event, newValue) => {
    setTab(newValue);
  };

  const [open, setOpen] = useState({
    addModal: false,
    deleteModal: false,
    editModal: false,
  });
  const [user, setUser] = useState(null);
  const initialValues = {
    status: "",
    firstname: "",
    lastname: "",
    email: "",
    departmentname: "",
    universityURL: "",
  };
  const handleOpen = (name, id) => {
    setOpen((prev) => ({ ...prev, [name]: true }));
    if (Boolean(id)) {
      setUser(() => {
        const foundUser = data.find((user) => user.userId._id === id);
        setValues({
          status: foundUser.status,
          firstname: foundUser.userId.firstname,
          lastname: foundUser.userId.lastname,
          email: foundUser.userId.email,
          departmentname: foundUser.departmentName,
          universityURL: foundUser.universityURL,
        });
        return foundUser;
      });
    }
  };
  const handleDeleteOpen = (name, id) => {
    setOpen((prev) => ({ ...prev, [name]: true }));
    setUser(() => {
      return data.find((data) => data.userId._id === id);
    });
  };
  const handleClose = (name) => setOpen((prev) => ({ ...prev, [name]: false }));

  const updateUserData = async (id, values) => {
    try {
      const response = await http.put(`/admin/employer/${id}`, values);
      console.log(response);
      handleClose("editModal");
      navigate("/admin-dashboard/manage-employers");
    } catch (error) {
      console.log();
    }
  };

  const {
    values,
    setValues,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik({
    initialValues,
    validationSchema: adminEditEmployerValidationSchema,
    onSubmit: (values, actions) => {
      const trimmedValues = {
        ...values,
        firstname: values.firstname.trim(),
        lastname: values.lastname.trim(),
      };
      console.log(trimmedValues);
      updateUserData(user.userId._id, trimmedValues);
    },
  });

  const handleDelete = async () => {
    try {
      console.log(user);
      const response = await http.delete(`/admin/employer/${user.userId._id}`);
      if (response.status === 200) {
        navigate("/admin-dashboard/manage-employers");
      }
      handleClose("deleteModal");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container my-3 bg-white py-3 px-2 rounded grey-border">
      <div className="d-flex justify-content-end pe-4">
        <Button
          variant="contained"
          onClick={() => handleOpen("addModal")}
          startIcon={<AddOutlinedIcon />}
        >
          Add Employer
        </Button>
      </div>

      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTab}>
            <Tab
              label="All"
              value="1"
              style={{ fontWeight: tab === "1" ? "bold" : "normal" }}
            />
            <Tab
              label="Active"
              value="2"
              style={{ fontWeight: tab === "2" ? "bold" : "normal" }}
            />
            <Tab
              label="Pending"
              value="3"
              style={{ fontWeight: tab === "3" ? "bold" : "normal" }}
            />
            <Tab
              label="Rejected"
              value="4"
              style={{ fontWeight: tab === "4" ? "bold" : "normal" }}
            />
          </TabList>
        </Box>

        <TabPanel value="1">
          <DataTable />
        </TabPanel>
        <TabPanel value="2">
          <DataTable status="active" />
        </TabPanel>
        <TabPanel value="3">
          <DataTable status="pending" />
        </TabPanel>
        <TabPanel value="4">
          <DataTable status="rejected" />
        </TabPanel>
      </TabContext>

      <Modal open={open.addModal} onClose={() => handleClose("addModal")}>
        <Box sx={style}>
          <AdminEmployerForm
            onSuccess={() => {
              handleClose("addModal");
              navigate("/admin-dashboard/manage-employers");
            }}
          />
        </Box>
      </Modal>

      <Modal open={open.deleteModal} onClose={() => handleClose("deleteModal")}>
        <Box sx={style}>
          <h3 className="text-center">Are you sure?</h3>
          <p className="text-center mb-4">
            Do you want to delete this employer? This will also delete any jobs
            or hiring tests made by the employer
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="contained"
              onClick={() => handleClose("deleteModal")}
              color="grey"
              sx={{ color: "#FFF" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="danger"
              sx={{ color: "#FFF" }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </Box>
      </Modal>

      <Modal open={open.editModal} onClose={() => handleClose("editModal")}>
        <Box sx={style}>
          <EmployerEditProfileForm
            userData={user}
            role="admin"
            updateUserData={() => {
              navigate("/admin-dashboard/manage-employers");
              handleClose("editModal");
            }}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default AdminManageEmployersPage;
