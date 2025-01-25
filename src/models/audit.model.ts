import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  actionType: {
    type: String,
  },
});

const audit = mongoose.model("Audit", auditSchema);

export default audit;
