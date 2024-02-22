import mongoose, { Model } from "mongoose";
const Schema = mongoose.Schema;

const hiringTestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    shuffleQuestions: {
      type: Boolean,
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          trim: true,
        },
        optionA: {
          type: String,
          trim: true,
        },
        optionB: {
          type: String,
          trim: true,
        },
        optionC: {
          type: String,
          trim: true,
        },
        optionD: {
          type: String,
          trim: true,
        },
        correctOption: {
          type: String,
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
