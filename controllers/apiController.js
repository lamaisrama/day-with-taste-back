import Visitor from "../models/Visitor";
import Result from "../models/Result";
import { json } from "body-parser";

export const updateVisitorCount = async (req, res) => {
  let today = getYearMonthDate();
  await Visitor.findOneAndUpdate(
    { date: today },
    { $inc: { count: 1 } },
    { new: true, upsert: true },
    (err, visitor) => {
      if (err) {
        console.log(`Something wrong when updating data : ${err}`);
        return res.status(500).json(err);
      }
      return res.status(200).json(visitor);
    }
  );
};

export const saveResult = async (req, res, next) => {
  const {
    body: { music, result },
  } = req;
  await new Result({ music, result }).save((err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(`Submit Success : ${result}`);
  });
  next();
};

export const findRandomMusic = (req, res) => {
  let result = req.body.result;
  res.send(`[What to do next week]`);
};

const getYearMonthDate = () => {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let date = today.getDate();
  today = "" + year + month + date;
  console.log(today);
  return today;
};
