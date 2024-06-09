import mongoose from "mongoose";
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  profileImage: { type: String, default: null },
  profileDescription: { type: String, default: null },
  resumeFile: { type: String, default: null },
  qualification: [
    {
      instituteName: { type: String, default: null, trim: true },
      field: { type: String, default: null, trim: true },
      level: { type: String, default: null, trim: true },
      grade: { type: String, default: null, trim: true },
      date: {
        startDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
      },
      location: {
        country: { type: String, default: null, trim: true },
        city: { type: String, default: null, trim: true },
      },
    },
  ],
  skills: { type: Array, default: [] },
  experience: [
    {
      title: { type: String, default: null, trim: true },
      company: { type: String, default: null, trim: true },
      isCurrentlyWorking: { type: Boolean, default: false },
      date: {
        startDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
      },
      location: {
        country: { type: String, default: null, trim: true },
        city: { type: String, default: null, trim: true },
      },
    },
  ],
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});

const Teacher = mongoose.model("Teacher", teacherSchema, "teacher");

export default Teacher;
