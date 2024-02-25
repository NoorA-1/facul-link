import mongoose, { Model, SchemaTypes } from "mongoose";
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    requiredQualification: {
      type: String,
      required: true,
      trim: true,
    },
    requiredExperience: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    isTestEnabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    hiringTest: {
      type: Schema.Types.ObjectId,
      ref: "HiringTest",
    },
    totalPositions: {
      type: Number,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "UniEmployer",
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema, "job");

export default Job;
