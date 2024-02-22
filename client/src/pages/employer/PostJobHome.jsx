import React, { useEffect, useState } from "react";
import { NavLink, useLoaderData, useNavigate } from "react-router-dom";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
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
  Alert,
  Chip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import http from "../../utils/http";
import { useDashboardContext } from "../DashboardLayout";
import dayjs from "dayjs";

export const loader = async () => {
  try {
    const { data } = await http.get("/employer/jobs");
    return data;
  } catch (error) {
    return null;
  }
};

const PostJobHome = () => {
  const jobsData = useLoaderData();
  console.log(jobsData);
  const { successMessage } = useDashboardContext();
  const MessageBox = () => {
    return (
      successMessage && (
        <Alert variant="filled" severity="success">
          {successMessage}
        </Alert>
      )
    );
  };
  return (
    <div className="container my-3 bg-white py-3 px-5 rounded grey-border">
      <div className="d-flex justify-content-between my-3">
        <h3 className="fw-bold">Post Jobs</h3>
        <NavLink
          to="add"
          style={{ color: "unset", textDecoration: "unset" }}
          end
        >
          <Button variant="contained" startIcon={<AddOutlinedIcon />}>
            Add Job
          </Button>
        </NavLink>
      </div>
      <MessageBox />
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
              <TableCell align="right" className="fw-bold">
                Location
              </TableCell>
              <TableCell align="right" className="fw-bold">
                Qualification
              </TableCell>
              <TableCell align="right" className="fw-bold">
                Experience
              </TableCell>
              <TableCell align="right" className="fw-bold">
                Hiring Test
              </TableCell>
              <TableCell align="right" className="fw-bold">
                End Date
              </TableCell>
              <TableCell align="right" className="fw-bold">
                Status
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobsData.length > 0 ? (
              jobsData.map((e, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {e.title}
                  </TableCell>
                  <TableCell align="right">{e.location}</TableCell>
                  <TableCell align="right">{e.requiredQualification}</TableCell>
                  <TableCell align="right">
                    {e.requiredExperience > 1
                      ? `${e.requiredExperience} Years`
                      : `${e.requiredExperience} Year`}
                  </TableCell>
                  {e.hiringTest !== null ? (
                    <TableCell align="right">{e.hiringTest.title}</TableCell>
                  ) : (
                    <TableCell align="right" className="text-danger">
                      {"None"}
                    </TableCell>
                  )}
                  <TableCell align="right">
                    {dayjs(e.endDate).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      className="fw-bold"
                      label={
                        dayjs()
                          .startOf("day")
                          .isAfter(dayjs(e.endDate).startOf("day"))
                          ? "Expired"
                          : "Active"
                      }
                      color={
                        dayjs()
                          .startOf("day")
                          .isAfter(dayjs(e.endDate).startOf("day"))
                          ? "error"
                          : "success"
                      }
                      variant="contained"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <div className="d-flex justify-content-end ">
                      <IconButton type="submit" color="secondary">
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton color="danger">
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
    </div>
  );
};

export default PostJobHome;
