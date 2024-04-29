import { io, userSockets } from "../app.js";

export const notifyUserEmit = (userId, data) => {
  const applicantSocketId = userSockets[userId];
  if (applicantSocketId) {
    io.to(applicantSocketId).emit("notifyUser", {
      data,
    });
  }
};

export const updateNotificationEmit = (userId, notification) => {
  const applicantSocketId = userSockets[userId];
  if (applicantSocketId) {
    io.to(applicantSocketId).emit("updateNotification", { notification });
  }
};
