import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Paper,
  Button,
} from "@mui/material";
import http from "../../utils/http";
import { useLoaderData, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export const loader = async () => {
  try {
    const { data } = await http.get("/employer/applications");
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const JobApplications = () => {
  const data = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="mx-auto my-3">
      <div className="bg-white py-4 rounded grey-border px-5">
        <h5 className="text-center fw-bold">Job Applications</h5>
        <hr />
        <TableContainer
          sx={{ border: "1px solid #0A9396" }}
          className="mb-4"
          component={Paper}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell className="fw-bold">Job Title</TableCell>
                {/* <TableCell align="right" className="fw-bold">
                Location
              </TableCell> */}
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
                  Positions
                </TableCell>
                <TableCell align="center" className="fw-bold">
                  End Date
                </TableCell>
                <TableCell align="center" className="fw-bold">
                  Candidates
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 &&
                data.map((e, index) => (
                  <TableRow
                    key={e.jobId._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {e.jobId.title}
                    </TableCell>
                    <TableCell align="right">
                      {e.jobId.requiredQualification.degree}
                    </TableCell>
                    <TableCell align="right">
                      {e.jobId.requiredExperience > 1
                        ? e.jobId.requiredExperience >= 6
                          ? "More than 5 years"
                          : `${e.jobId.requiredExperience} Years`
                        : `${e.jobId.requiredExperience} Year`}
                    </TableCell>
                    {e.jobId.hiringTest !== null ? (
                      <TableCell align="right">
                        {e.jobId.hiringTest.title}
                      </TableCell>
                    ) : (
                      <TableCell align="right" className="text-danger">
                        {"None"}
                      </TableCell>
                    )}
                    <TableCell align="right">
                      {e.jobId.totalPositions}
                    </TableCell>
                    <TableCell align="right">
                      {dayjs(e.jobId.endDate).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() =>
                          navigate(
                            `/dashboard/job-application/candidate/${e.jobId._id}`
                          )
                        }
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default JobApplications;
