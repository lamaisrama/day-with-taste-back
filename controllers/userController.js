import Visitor from "../models/Visitor";
import Result from "../models/Result";
import dotenv from "dotenv";
import uniqId from "uniqid";

dotenv.config();

export const updateVisitorCount = async (req, res) => {
  let today = getYearMonthDate();
  Visitor.findOneAndUpdate(
    { date: today },
    { $inc: { count: 1 } },
    { new: true, upsert: true },
    (err, visitor) => {
      if (err) {
        console.log(`Something wrong when updating data : ${err}`);
        return res.status(500).json({
          success: false,
          msg: 'DB_ERROR'
        });
      }
      return res.status(200).json({
        success: true,
        data: visitor
      });
    }
  );
};

export const saveResult = (req, res) => {
  const {
    body: { music, result, randomMusic },
  } = req;

  new Result({ music, result }).save((err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        msg: 'DB_ERROR'
      });
    }
    console.log(`Submit Success : ${result}`);
  });
  res.status(200).json({
    success: true,
    data: {
      randomMusic: randomMusic
    }
  });
};


export const addResult = async (req, res) => {
  const {
    body: { url, artist, title, image, result, randomMusic }
  } = req;
  
  if(!url || !result) {
    console.log(url, result);
    return res.status(400).json({
      success: false,
      msg: "BAD_REQUEST"
    });
  }

  console.log('addResult',randomMusic);
  // generate ID
  var music;
  while(true) {
    music = uniqId.process();
    const data = await Result.find({ music: music });
    console.log(data);
    if(data.length == 0) break;
  }

  console.log('=====');
  console.log(`music: ${music}`);
  console.log(`url: ${url}`);
  console.log(`artist: ${artist}`);
  console.log(`title: ${title}`);
  console.log(`image: ${image}`)
  console.log(`result: ${result}`);
  console.log('=====');

  new Result({ music, url, artist, title, image, result }).save((err, result) => {
    if(err) {
      return res.status(500).json({
        success: false,
        msg: 'DB_ERROR'
      });
    }
    console.log(`Submit Success : ${result}`);
    
    return res.status(200).json({
      success: true,
      data: {
        randomMusic: randomMusic
      }
    });
  });
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