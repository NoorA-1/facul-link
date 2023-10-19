import mongoose from "mongoose";
const Schema = mongoose.Schema;

const uniEmployerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  profileImage: { type: String, default: null },
  profileDescription: { type: String, default: null },
  universityName: { type: String, default: null },
  departmentName: { type: String, default: null },
  // universityLocation: { type: String, default: null },
});

const UniEmployer = mongoose.model(
  "UniEmployer",
  uniEmployerSchema,
  "uniemployer"
);

export default UniEmployer;
