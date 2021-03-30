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

export const findRandomMusic = async(req, res) => {
  let result = req.body.result;
  resultArray = result.split("");
  let searchedResultArray;                        // 해당 결과와 동일한 결과를 가진 결과 도큐먼트의 Array
  let resultToSend = {result, randomMusic: null}  // response로 보내 줄 객체

  try{
    // 전체 일치 하는 경우 
    searchedResultedArray = await Result.find({result});
    if (searchedResultedArray.length>0 ) {
      resultToSend.randomMusic = getRandomMusicFromResults(searchedResultArray);
      break;
    }
    // 하나 다를 경우 (90.90%)
    let randomIndexArray = getDifferentOneIndexArray();
    let flag=true;
    for (let i=0; i<randomIndexArray.length; i++) {
      // 만약 한번이라도 동일한 결과 값을 가진 document를 찾았다면 for문 끝
      if (!flag) break;
      
      //해당 인덱스 수정
      resultArray[randomIndexArray[i]] = resultArray[randomIndexArray[i]]=== 0 ? 1 : 0 ;
      let resultString = resultArray.toString();   // [Todo1] : 이렇게 하면 "1,2,3,4,5" 의 형태로 Stringify => "12345"로 수정해야 함
      
      searchedResultedArray = await Result.find({result: resultString});
      // 결과값 찾으면 전송할 데이터의 randomMusic에 해당 값을 넣는다.
      if (searchedResultedArray.length>0 ) {      
        resultToSend.randomMusic = getRandomMusicFromResults(searchedResultArray);
        flag = false;
      }

    }

    // 두개 다를 경우 (81.81%)
    randomIndexArray = getDifferentTwoIndexArray();
    for (let i=0; i<randomIndexArray.length; i++) {
      if (!flag) break;

      let indexToFix = randomIndexArray[i];   // [m, n];
      resultArray[indexToFix[0]] = resultArray[indexToFix[0]]=== 0 ? 1 : 0 ;
      resultArray[indexToFix[1]] = resultArray[indexToFix[1]]=== 0 ? 1 : 0 ;

      let resultString = resultArray.toString();
      searchedResultedArray = await Result.find({result: resultString});

      if (searchedResultedArray.length>0 ) {
        resultToSend.randomMusic = getRandomMusicFromResults(searchedResultArray);
        flag = false;
      }
    }
    // 세개 다를 경우 (72.72%)
    randomIndexArray = getDifferentThreeIndexArray();
    for (let i=0; i<randomIndexArray.length; i++) {
      if (!flag) break;

      let indexToFix = randomIndexArray[i];   // [m, n, o];
      resultArray[indexToFix[0]] = resultArray[indexToFix[0]]=== 0 ? 1 : 0 ;
      resultArray[indexToFix[1]] = resultArray[indexToFix[1]]=== 0 ? 1 : 0 ;
      resultArray[indexToFix[2]] = resultArray[indexToFix[2]]=== 0 ? 1 : 0 ;

      let resultString = resultArray.toString();
      searchedResultedArray = await Result.find({result: resultString});

      if (searchedResultedArray.length>0 ) {
        resultToSend.randomMusic = getRandomMusicFromResults(searchedResultArray);
        flag = false;        
      }
    }
    // [TODOS] : IF NOT? 
    
  }catch(err) {
    console.log(err);
    return res.status(500).json(err);
  }
  res.status(200).json(resultToSend);
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


const shuffle = (array) => {
  var j, x, i; 
  for (i = array.length; i; i -= 1) { 
    j = Math.floor(Math.random() * i);
    x = array[i - 1]; 
    array[i - 1] = array[j]; 
    array[j] = x; 
  }
}

const getRandomMusicFromResults = (array) => {
  shuffle(array);
  return array[0].music;
}

const getDifferentOneIndexArray = () => {
  let arr = [];
  for (let i =0; i < 11 ; i++ ) {
    arr.push(i);
  }
  shuffle(arr);
  return arr;
}

const getDifferentTwoIndexArray = () => {
  let arr = [];
  for (let i =0; i < 11 ; i ++)  {
    for (let j=i+1 ; j<11 ; j++) {
      arr.push([i, j]);
    }
  }
  shuffle(arr);
  return arr;
}

const getDifferentThreeIndexArray = () => {
  let arr = [];
  for (let i=0; i< 11; i++) {
    for (let j=i+1; j<11; j++) {
      for (let k=j+1; k<11; k++) {
        arr.push([i,j,k]);
      }
    }
  }
  shuffle(arr);
  return arr
}