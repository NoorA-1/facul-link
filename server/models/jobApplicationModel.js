import mongoose from "mongoose";
const Schema = mongoose.Schema;

const jobApplicationSchema = new Schema(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Teacher",
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
      completedTime: {
        time: {
          type: Date,
        },
        isTimeUp: {
          type: Boolean,
        },
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
      enum: [
        "pending",
        "applied",
        "shortlisted",
        "interview",
        "hired",
        "rejected",
      ],
      default: "pending",
    },
    text: {
      type: String,
    },
    interviewDetails: {
      mode: {
        type: String,
        enum: ["in-person", "online"],
      },
      meetingURL: { type: String },
      location: { type: String },
      date: { type: Date },
      time: { type: Date },
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
