import React, { useState } from "react";
import {
  Box,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import { useLoaderData } from "react-router-dom";
import http from "../../utils/http";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
export const loader = async () => {
  try {
    const { data } = await http.get("/admin/all-employers");
    return data;
  } catch (error) {
    return null;
  }
};

const AdminManageEmployersPage = () => {
  const data = useLoaderData();
  console.log(data);
  const [tab, setTab] = useState("1");

  const handleTab = (event, newValue) => {
    setTab(newValue);
  };
  return (
    <div className="container my-3 bg-white py-3 px-5 rounded grey-border">
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
          </TabList>
        </Box>
        <TabPanel value="1">
          <div className="">
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
                  {data.length > 0 ? (
                    data.map((e, index) => (
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
                        <TableCell align="left">{e.status}</TableCell>
                        <TableCell align="right">
                          <div className="d-flex justify-content-start ">
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
                        colSpan="5"
                        style={{ textAlign: "center", padding: 35 }}
                      >
                        <FolderOffOutlinedIcon
                          color="disabled"
                          fontSize="large"
                        />
                        <p className="text-secondary">No tests found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
      </TabContext>
    </div>
  );
};

export default AdminManageEmployersPage;
