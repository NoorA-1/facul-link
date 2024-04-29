import React from "react";
import http from "../utils/http";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useLoaderData, useNavigate } from "react-router-dom";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import { Badge, IconButton } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useDashboardContext } from "./DashboardLayout";
dayjs.extend(relativeTime);

const Notifications = () => {
  //   const data = useLoaderData();
  const { notifications, setNotifications } = useDashboardContext();
  const navigate = useNavigate();

  const markNotification = async (notification, markRead) => {
    try {
      const data = {
        ...notification,
        isMarkedRead: markRead,
      };
      console.log(notifications);
      const response = await http.put(
        `/users/notifications/${notification._id}`,
        data
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container my-3 bg-white py-5 px-5 rounded grey-border">
      <h4 className="fw-semibold">Notifications</h4>
      <hr />

      {notifications.length > 0 ? (
        notifications
          .sort((a, b) => dayjs(b.createdAt) - dayjs(a.createdAt))
          .map((e, index) => (
            <div
              key={index}
              className="notification grey-border px-3 py-3 shadow-sm rounded mb-3"
              onClick={() => {
                if (Boolean(e.message)) {
                  navigate(`/dashboard/${e.onClickURL}`);
                  markNotification(e, true);
                }
              }}
              role={Boolean(e.message) ? "button" : ""}
            >
              <div className="d-flex align-items-center justify-content-between ">
                <div className="d-flex align-items-center gap-3">
                  {!e.isMarkedRead ? (
                    <Badge variant="dot" color="error">
                      <NotificationsOutlinedIcon />
                    </Badge>
                  ) : (
                    <NotificationsOutlinedIcon />
                  )}
                  <div className="pt-1">
                    <h6 className="m-0">{e.title}</h6>
                    <p className="m-0 text-light-emphasis">
                      {dayjs(e.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
                <div className="pb-2">
                  {!e.isMarkedRead ? (
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        markNotification(e, true);
                      }}
                    >
                      <MarkunreadOutlinedIcon color="primary" />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        markNotification(e, false);
                      }}
                    >
                      <DraftsOutlinedIcon color="grey" />
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
          ))
      ) : (
        <div className="d-flex flex-column align-items-center gap-2 mt-4">
          <NotificationsOffOutlinedIcon fontSize="large" color="disabled" />
          <p className="text-secondary">No notifications found</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
