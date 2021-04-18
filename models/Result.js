import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
  music: String,
  result: String,
  regDt: Date,

  url: String,
  artist: String,
  title: String,
  image: String
});

const model = mongoose.model("Result", ResultSchema);
export default model;
