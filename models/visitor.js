import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
  date: String,
  count: Number,
});

const model = mongoose.model("Visitor", VisitorSchema);
export default model;
