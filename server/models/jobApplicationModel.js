import mongoose from "mongoose";
const Schema = mongoose.Schema;

const jobApplicationSchema = new Schema(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    jobId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Job",
    },
    resumeFile: {
      type: String,
      required: true,
    },
    contactNumber: {
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
      score: {
        type: Number,
      },
      correctAnswers: [
        {
          questionId: {
            type: Schema.Types.ObjectId,
          },
          answer: {
            type: String,
          },
        },
      ],
      wrongAnswers: [
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
      enum: ["pending", "applied", "shortlisted", "rejected"],
      default: "pending",
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
  "jobApplication"
);

export default JobApplication;
