import mongoose from "mongoose";
const Schema = mongoose.Schema;

const uniEmployerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  profileImage: { type: String, default: null },
  universityLogo: { type: String, default: null },
  profileDescription: { type: String, default: null, trim: true },
  universityName: { type: String, default: null, trim: true },
  departmentName: { type: String, default: null, trim: true },
  universityURL: { type: String, default: null, trim: true },
  status: {
    type: String,
    enum: ["active", "pending", "rejected"],
    default: "pending",
  },
  // universityLocation: { type: String, default: null },
});

const UniEmployer = mongoose.model(
  "UniEmployer",
  uniEmployerSchema,
  "uniemployer"
);

export default UniEmployer;
