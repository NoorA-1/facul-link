import mongoose, { Model } from "mongoose";
const Schema = mongoose.Schema;

const hiringTestSchema = new Schema(
  {
    title: {
      type: "string",
      required: true,
      trim: true,
    },
    duration: {
      type: "number",
      required: true,
    },
    shuffleQuestions: {
      type: "boolean",
      required: true,
    },
    questions: [
      {
        question: {
          type: "string",
          trim: true,
        },
        optionA: {
          type: "string",
          trim: true,
        },
        optionB: {
          type: "string",
          trim: true,
        },
        optionC: {
          type: "string",
          trim: true,
        },
        optionD: {
          type: "string",
          trim: true,
        },
        correctOption: {
          type: "string",
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const HiringTest = mongoose.model("HiringTest", hiringTestSchema, "hiringTest");

export default HiringTest;
