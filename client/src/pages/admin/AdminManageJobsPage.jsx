import React, { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Paper,
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Chip,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import dayjs from "dayjs";
import http from "../../utils/http";
import { useNavigate, useLoaderData } from "react-router-dom";
import { programNamesList, skillsList } from "../../utils/formData";
import { jobPostValidationSchema } from "../../schemas";
import { AdminJobForm } from "../../components";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export const loader = async () => {
  try {
    const { data } = await http.get("/admin/jobs");
    const { data: testsData } = await http.get("/admin/get-hiring-tests");
    return { data, testsData };
  } catch (error) {
    return null;
  }
};

let initialValues = {
  title: "",
  description: "",
  location: "",
  requiredQualification: {
    degree: "",
    field: [],
  },
  requiredExperience: "",
  skills: [],
  isTestEnabled: false,
  hiringTest: "",
  endDate: null,
  totalPositions: 1,
};

const AdminManageJobsPage = () => {
  const { data: jobsData } = useLoaderData();
  const { testsData } = useLoaderData();
  const [open, setOpen] = useState({
    deleteModal: false,
    editModal: false,
  });
  const [currentJobId, setCurrentJobId] = useState(null);

  const navigate = useNavigate();

  const handleOpen = (name, id) => {
    setOpen((prev) => ({ ...prev, [name]: true }));
    setCurrentJobId(id);
    const foundData = jobsData.find((e) => e._id === id);

    initialValues = {
      title: foundData.title,
      description: foundData.description,
      location: foundData.location,
      requiredQualification: {
        degree: foundData.requiredQualification.degree,
        field: foundData.requiredQualification.field,
      },
      requiredExperience: foundData.requiredExperience,
      skills: foundData.skills,
      isTestEnabled: foundData.isTestEnabled,
      hiringTest: foundData.hiringTest ? foundData.hiringTest._id : "",
      totalPositions: foundData.totalPositions,
      endDate: dayjs(foundData.endDate),
    };
  };

  const handleClose = (name) => setOpen((prev) => ({ ...prev, [name]: false }));

  const onSubmit = async (values) => {
    try {
      const response = await http.put(`/admin/jobs/${currentJobId}`, values);
      console.log(response);
      handleClose("editModal");
      navigate("/admin-dashboard/manage-jobs");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container my-3 bg-white py-3 px-5 rounded grey-border">
      <h3 className="fw-bold">Manage Jobs</h3>
      <hr className="mb-5" />
      <TableContainer
        sx={{ border: "1px solid #0A9396" }}
        className="mb-4"
        component={Paper}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell className="fw-bold">Title</TableCell>

              <TableCell align="left" className="fw-bold">
                Posted By
              </TableCell>
              <TableCell align="left" className="fw-bold">
                University
              </TableCell>
              <TableCell align="center" className="fw-bold">
                End Date
              </TableCell>
              <TableCell align="center" className="fw-bold">
                Status
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobsData.length > 0 ? (
              jobsData.map((job, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {job.title}
                  </TableCell>

                  <TableCell align="left">
                    {job.createdBy.userId.firstname +
                      " " +
                      job.createdBy.userId.lastname}
                  </TableCell>
                  <TableCell align="left">
                    {job.createdBy.universityName}
                  </TableCell>
                  <TableCell align="center">
                    {dayjs(job.endDate).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      className="fw-bold"
                      label={
                        dayjs()
                          .startOf("day")
                          .isAfter(dayjs(job.endDate).startOf("day"))
                          ? "Expired"
                          : "Active"
                      }
                      color={
                        dayjs()
                          .startOf("day")
                          .isAfter(dayjs(job.endDate).startOf("day"))
                          ? "error"
                          : "success"
                      }
                      variant="contained"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <div className="d-flex justify-content-end">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(`/admin-dashboard/jobs/${job._id}`)
                        }
                      >
                        <VisibilityOutlinedIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleOpen("editModal", job._id)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton
                        color="danger"
                        onClick={() => handleOpen("deleteModal")}
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
                  colSpan="7"
                  style={{ textAlign: "center", padding: 35 }}
                >
                  <FolderOffOutlinedIcon color="disabled" fontSize="large" />
                  <p className="text-secondary">No jobs found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open.editModal} onClose={() => handleClose("editModal")}>
        <Box sx={style}>
          <AdminJobForm
            initialValues={initialValues}
            validationSchema={jobPostValidationSchema}
            onSubmit={onSubmit}
            testsData={testsData}
            skillsList={skillsList}
            programNamesList={programNamesList}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default AdminManageJobsPage;
