import Visitor from "../models/Visitor";
import Result from "../models/Result";

export const updateVisitorCount = async (req, res) => {
  let flag = true;
  let today = getYearMonthDate();
  await Visitor.findOne({ date: today }, (err, visitor) => {
    if (!visitor) {
      console.log("Today's First visitor");
      flag = false;
      saveTodayVisitor(today);
    } else {
      updateTodayVisitor(today);
    }
  });

  res.send(
    flag ? "update" : "create" + " || " + "There are a lot left to do...."
  );
};

const saveTodayVisitor = async today => {
  const todayFirstVisitor = await new Visitor({
    date: today,
    count: 1,
  });
  todayFirstVisitor.save(err => {
    if (err) throw err;
  });
};

const updateTodayVisitor = async today => {
  console.log("update Today visitor");
  let visitor = await Visitor.findOneAndUpdate(
    { date: today },
    { $inc: { count: 1 } }
  );
  console.log(visitor);
};

export const saveResult = async (req, res, next) => {
  const {
    body: { music, result },
  } = req;
  console.log(req.body);
  //console.log(music, result);
  try {
    const newResult = await new Result({
      music,
      result,
      created: new Date(),
    });
    await newResult.save(err => {
      if (err) console.log(err);
    });
  } catch (err) {
    console.log(err);
  }
  next();
};

export const findRandomMusic = (req, res) => {
  let result = req.body.result;
  res.send(`${result} done`);
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
