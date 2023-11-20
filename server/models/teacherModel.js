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
      instituteName: { type: String, default: null },
      field: { type: String, default: null },
      level: { type: String, default: null },
      grade: { type: String, default: null },
      date: {
        startDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
      },
      location: {
        country: { type: String, default: null },
        city: { type: String, default: null },
      },
    },
  ],
  skills: { type: Array, default: [] },
  experience: [
    {
      title: { type: String, default: null },
      company: { type: String, default: null },
      isCurrentlyWorking: { type: Boolean, default: false },
      date: {
        startDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
      },
      location: {
        country: { type: String, default: null },
        city: { type: String, default: null },
      },
    },
  ],
});

const Teacher = mongoose.model("Teacher", teacherSchema, "teacher");

export default Teacher;
