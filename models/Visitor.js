import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
  date: Date,
  count: Number,
});

const model = mongoose.model("Vistor", VisitorSchema);
export default model;
