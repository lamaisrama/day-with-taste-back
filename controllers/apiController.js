import Visitor from "../models/Visitor";
import Result from "../models/Result";
import { json } from "body-parser";
import Youtube from "youtube-node";
import dotenv from "dotenv";

dotenv.config();

const youtube = new Youtube();
youtube.setKey(process.env.YOUTUBE_KEY);

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

export const searchMusic = async (req, res, next) => {
  var pageToken = req.body.pageToken;
  youtube.addParam('order', 'relevance'); // 관련성 순서
  youtube.addParam('type', 'video'); // 타입 지정 
  youtube.addParam('part', 'snippet');
  youtube.addParam('regionCode', 'KR');
  youtube.addParam('safeSearch', 'moderate');
  youtube.addParam('pageToken', pageToken);
  var limit = 5;
  var word = req.body.keyword;

  console.log('검색어 : '+word);
  console.log('=======================================')
  youtube.search(word, limit, function (err, result) { // 검색 실행 
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
          list.push({title: title, video_id: video_id, url: url, thumbnails: thumbnails});
          console.log("제목 : " + title); 
          console.log("URL : " + url); 
          console.log("-----------"); 
      }
      var info = {item:list, nextPage:nextPageToken, prevPage:prevPageToken};
      return res.status(200).json(info);
  });
}


export const saveResult = async (req, res, next) => {
  const {
    body: { music, result },
  } = req;
  var regDt = new Date();
  new Result({ music, result, regDt }).save((err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(`Submit Success : ${result}`);
  });
  next();
};

export const findRandomMusic = async (req, res, next) => {
  let result = req.body.result;
  let music = req.body.music;
  
  // 모두 일치하는 경우
  var docList = await Result.find(
    { $and: [{ result: result }
            ,{ music:{$ne : music} }]
    });
  if(docList.length>0) {
    var randomMusic = getRandomMusic(docList);
    return res.status(200).json({result, randomMusic});
  }

  // 1개 다른 경우
  for(var i=0; i<result.length; i++) {
    var temp = result.split("");
    temp[i] = temp[i]==0?1:0;
    var simliarResult = temp.join('');

    docList = await Result.find(
      { $and : [{ result: simliarResult }
               ,{ music:{$ne : music} }]
      });
    if(docList.length>0) {
      var randomMusic = getRandomMusic(docList);
      return res.status(200).json({result, randomMusic});
    }
  }

  // 무작위 추출
  docList = await Result.aggregate(
      [{ $match: {music:{$ne: music}} }]
      ,[{ $sample:{size:1} }]
    );
  var randomMusic = getRandomMusic(docList);
  return res.status(200).json({result, randomMusic});
  
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


const getRandomArbitrary = (max) => {
  return Math.floor(Math.random() * max);
}

const getRandomMusic = (docList) => {
  var randomIndex = getRandomArbitrary(0, docList.length);
  return docList[randomIndex].music;
}
