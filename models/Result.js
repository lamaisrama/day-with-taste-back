import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  music: String,
  result: String,
  created: Date,
});

resultSchema.pre("save", next => {
  const currDate = new Date();
  this.created = currDate;
  next();
});

const model = new mongoose.Schema("Result", resultSchema);

export default model;
