import {
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Autocomplete,
  createFilterOptions,
  Chip,
} from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import http from "../utils/http";
import { useLoaderData } from "react-router-dom";
import { JobPostCard } from "../components";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import { serverURL } from "../utils/formData";
import Pagination from "@mui/material/Pagination";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const loader = async () => {
  try {
    const { data } = await http.get("/users/search-jobs");
    const { data: filtersData } = await http.get("/users/search-jobs/filters");

    return {
      data,
      skillsList: filtersData.skillsList,
      universitiesList: filtersData.universitiesList,
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const SearchJob = () => {
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { data, skillsList, universitiesList } = useLoaderData();
  const [jobsData, setJobsData] = useState(data);
  const titleRef = useRef("");
  const qualificationRef = useRef("");
  const experienceRef = useRef("");
  const universityRef = useRef("");

  const [page, setPage] = useState(1);
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    getJobs();
  }, [page]);

  const handleAddSkill = (event, newSkills) => {
    setSkills(newSkills);
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(() => newInputValue);
  };

  const handleDeleteSkill = (skillToDelete) => () => {
    setSkills((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToDelete)
    );
  };

  const getJobs = async () => {
    try {
      const skillsQuery =
        skills.length > 0
          ? skills.map((skill) => `skills[]=${skill}`).join("&")
          : "";

      const qualification =
        qualificationRef.current.value === "0"
          ? ""
          : qualificationRef.current.value;

      const experience =
        experienceRef.current.value === "0" ? "" : experienceRef.current.value;

      const university =
        universityRef.current.value === "0" ? "" : universityRef.current.value;

      const queryString = `title=${titleRef.current.value}&degree=${qualification}&experience=${experience}&${skillsQuery}&page=${page}&universityName=${university}`;
      const { data } = await http.get(`/users/search-jobs?${queryString}`);
      setJobsData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterOptions = createFilterOptions({
    ignoreCase: true,
    matchFrom: "start",
    limit: 10,
  });

  return (
    <div className=" mx-auto mt-5 mb-3">
      <div className="d-flex align-items-center justify-content-center">
        <TextField
          label="Search jobs"
          className="bg-white w-75"
          variant="outlined"
          inputRef={titleRef}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => getJobs()}
                >
                  Search
                </Button>
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </div>
      <div className="bg-white py-5 mt-5 rounded grey-border px-5">
        <div className="row flex-column flex-sm-row">
          <div className="col-12 col-md-3 col-lg-2 pe-4 col-2 border-end border-1">
            <h5 className="fw-semibold">Filter</h5>

            <div className="filter mt-4">
              <TextField
                select
                fullWidth
                inputRef={qualificationRef}
                variant="standard"
                label="Select Qualification"
                size="small"
                defaultValue="0"
              >
                <MenuItem value="0">All</MenuItem>
                <MenuItem value="Bachelors">Bachelors</MenuItem>
                <MenuItem value="Masters">Masters</MenuItem>
              </TextField>
            </div>

            <div className="filter mt-4">
              <TextField
                select
                fullWidth
                inputRef={experienceRef}
                variant="standard"
                label="Select Experience"
                size="small"
                defaultValue="0"
              >
                <MenuItem value="0">All</MenuItem>
                <MenuItem value="1">1 Year</MenuItem>
                <MenuItem value="2">2 Years</MenuItem>
                <MenuItem value="3">3 Years</MenuItem>
                <MenuItem value="4">4 Years</MenuItem>
                <MenuItem value="5">5 Years</MenuItem>
                <MenuItem value="6">More than 5 Years</MenuItem>
              </TextField>
            </div>

            <div className="filter mt-4">
              <TextField
                select
                fullWidth
                inputRef={universityRef}
                variant="standard"
                label="Select University"
                size="small"
                defaultValue="0"
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxWidth: 200,
                        maxHeight: 300,
                        overflow: "auto",
                      },
                    },
                  },
                }}
              >
                <MenuItem value="0">All</MenuItem>
                {universitiesList.map((e, index) => (
                  <MenuItem
                    key={index}
                    value={e}
                    style={{ whiteSpace: "normal" }}
                  >
                    {e}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="filter mt-4">
              <Autocomplete
                multiple
                value={skills}
                onChange={handleAddSkill}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                options={skillsList}
                freeSolo
                filterOptions={filterOptions}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      onDelete={handleDeleteSkill(option)}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Skills"
                    // placeholder="Add skills"
                    fullWidth
                  />
                )}
              />
            </div>
          </div>
          <div className="col-12 col-md-9 col-lg-10 mt-md-0 mt-5">
            <h5 className="fw-semibold">Jobs Found: {jobsData.jobs.length}</h5>

            <div className="mt-3 w-100">
              {jobsData?.jobs && jobsData.jobs.length > 0 ? (
                jobsData.jobs.map((e, index) => (
                  <JobPostCard
                    key={index}
                    logo={`${serverURL}${
                      e.createdBy.universityLogo &&
                      e.createdBy.universityLogo.split("public\\")[1]
                    }`}
                    title={e.title}
                    universityName={e.createdBy.universityName}
                    location={e.location}
                    postedDate={dayjs(e.createdAt).fromNow()}
                    endDate={dayjs(e.endDate).format("DD-MM-YYYY")}
                    role="employer"
                    // isBookmarked={
                    //   Boolean(userData?.user?.bookmarks.includes(e._id))
                    //     ? true
                    //     : false
                    // }
                    // updateUserData={updateUserData}
                    jobId={e._id}
                  />
                ))
              ) : (
                <div className="d-flex align-items-center justify-content-center flex-column">
                  <FolderOffOutlinedIcon color="disabled" />
                  <p className="text-secondary">No jobs found</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <hr />
        <div className="d-flex align-items-center justify-content-center mt-4">
          <Pagination
            page={page}
            onChange={handlePageChange}
            count={jobsData.totalPages}
            color="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchJob;
