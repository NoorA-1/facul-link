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
        options: [
          {
            optionLabel: String,
            optionValue: {
              type: String,
              trim: true,
            },
          },
        ],
        correctOption: {
          type: String,
        },
      },
    ],
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

const HiringTest = mongoose.model("HiringTest", hiringTestSchema, "hiringTest");

export default HiringTest;
