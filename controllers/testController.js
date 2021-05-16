import Result from "../models/Result";
import dotenv from "dotenv";

dotenv.config();


export const deleteData = async (req, res, next) => {
  const arr = req.body.data;
  console.log(arr);
  await Result.deleteMany({}, (err, response) => {
    if(err) return res.status(500).json({
      success: false,
      msg: 'DB_ERROR'
    });
    next();
    return;
  });
}
  
export const getData = async(req, res) => {
  await Result.find({}, (err, data) => {
    if(err) {
      return res.status(500).json({
        success: false,
        msg: 'DB_ERROR'
      });
    }
    console.log(`result(${data.length}개)`);
    return res.status(200).json({
      success: true,
      data: data
    });
  })
}

  