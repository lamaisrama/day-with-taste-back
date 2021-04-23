import Result from "../models/Result";
import Youtube from "youtube-node";
import dotenv from "dotenv";

dotenv.config();

const youtube = new Youtube();
youtube.setKey(process.env.YOUTUBE_KEY);

export const searchYoutubeMusic = async (req, res, next) => {
    var pageToken = req.param("pageToken");
    youtube.addParam("order", "relevance"); // 관련성 순서
    youtube.addParam("type", "video"); // 타입 지정
    youtube.addParam("part", "snippet");
    youtube.addParam("regionCode", "KR");
    youtube.addParam("safeSearch", "moderate");
    youtube.addParam("pageToken", pageToken);
    var limit = 20;
    var word = req.param("keyword");
  
    console.log("검색어 : " + word);
    console.log("=======================================");
    youtube.search(word, limit, function (err, result) {
      // 검색 실행
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          msg: 'INTERNAL_SERVER_ERROR'
        });
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
      return res.status(200).json({
        success: true,
        data: info
      });
    });
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