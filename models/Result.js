import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
  music: String,
  result: String,
  regDt: Date,
});

const model = mongoose.model("Result", ResultSchema);
export default model;
