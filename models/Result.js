import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  music: String,
  result: String,
  created: Date,
});

const model = mongoose.model("Result", resultSchema);
export default model;
