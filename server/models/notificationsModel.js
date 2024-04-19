import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },

    isMarkedRead: {
      type: Boolean,
      required: true,
      default: false,
    },
    onClickURL: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

const Notifications = mongoose.model(
  "Notifications",
  notificationsSchema,
  "notifications"
);

export default Notifications;
