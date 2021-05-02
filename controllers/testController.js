import Result from "../models/Result";
import dotenv from "dotenv";

dotenv.config();


export const deleteData = async (req, res) => {
  const arr = req.query.data;
  await Result.deleteMany({ _id: {$in: arr} }, (err, response) => {
    if(err) return res.status(500).json({
      success: false,
      msg: 'DB_ERROR'
    });
    return res.status(200).json({success: true});
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

  