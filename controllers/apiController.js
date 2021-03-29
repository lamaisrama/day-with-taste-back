import Visitor from "../models/Visitor";
import Result from "../models/Result";
import Youtube from "youtube-node";
import dotenv from "dotenv";

dotenv.config();

const youtube = new Youtube();
youtube.setKey(process.env.YOUTUBE_KEY);

export const updateVisitorCount = async (req, res) => {
  let today = getYearMonthDate();
  Visitor.findOneAndUpdate(
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

export const searchMusic = async (req, res, next) => {
  // x-www-form-urlencoded 만 가능
  // TODO : HTTP 지정해서 json으로 전송 받을 것
  var pageToken = req.body.pageToken;
  youtube.addParam("order", "relevance"); // 관련성 순서
  youtube.addParam("type", "video"); // 타입 지정
  youtube.addParam("part", "snippet");
  youtube.addParam("regionCode", "KR");
  youtube.addParam("safeSearch", "moderate");
  youtube.addParam("pageToken", pageToken);
  var limit = 5;
  var word = req.body.keyword;

  console.log("검색어 : " + word);
  console.log("=======================================");
  youtube.search(word, limit, function (err, result) {
    // 검색 실행
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    } // 에러일 경우 에러공지하고 빠져나감
    var nextPageToken = result.nextPageToken;
    var prevPageToken = result.prevPageToken;
    var items = result["items"]; // 결과 중 items 항목만 가져옴
    var list = [];
    for (var i in items) {
      var it = items[i];
      var title = it["snippet"]["title"];
      var video_id = it["id"]["videoId"];
      var url = "https://www.youtube.com/watch?v=" + video_id;
      var thumbnails = it["snippet"]["thumbnails"];
      list.push({
        title: title,
        video_id: video_id,
        url: url,
        thumbnails: thumbnails,
      });
      console.log("제목 : " + title);
      console.log("URL : " + url);
      console.log("-----------");
    }
    var info = { item: list, nextPage: nextPageToken, prevPage: prevPageToken };
    return res.status(200).json(info);
  });
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
