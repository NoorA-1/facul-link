import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import React from "react";
import { useLoaderData } from "react-router-dom";
import { JobPostCard } from "../../components";
import { serverURL } from "../../utils/formData";
import http from "../../utils/http";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const loader = async () => {
  try {
    const { data } = await http.get("/teacher/all-bookmarks");
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const Bookmarks = () => {
  const data = useLoaderData();
  console.log(data);
  return (
    <div className="mx-auto mt-5 mb-3">
      <div className="bg-white py-5 mt-5 rounded grey-border px-5">
        <h5 className="text-center fw-bold">Your Bookmarks</h5>
        <hr />
        <div className="mt-3 w-100">
          {data.bookmarks.length > 0 ? (
            data.bookmarks.map((e, index) => (
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
                jobId={e._id}
              />
            ))
          ) : (
            <div className="d-flex align-items-center justify-content-center flex-column">
              <FolderOffOutlinedIcon color="disabled" />
              <p className="text-secondary">No jobs bookmarked</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
