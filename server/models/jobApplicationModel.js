import mongoose from "mongoose";
const Schema = mongoose.Schema;

const jobApplicationSchema = new Schema(
  {
    applicant: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    job: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Job",
    },
    resumeFile: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    test: {
      status: {
        type: String,
        required: true,
        enum: ["pending", "in progress", "completed", "no test"],
        default: "pending",
      },
      startTime: {
        type: Date,
      },
      endTime: {
        type: Date,
      },

      answers: [
        {
          questionId: {
            type: Schema.Types.ObjectId,
          },
          answer: {
            type: String,
          },
        },
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ["applied", "shortlisted", "rejected"],
      default: "applied",
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const JobApplication = mongoose.model(
  "JobApplication",
  jobApplicationSchema,
  "jobApplications"
);

export default JobApplication;
