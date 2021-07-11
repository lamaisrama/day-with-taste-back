import Result from "../models/Result";
import dotenv from "dotenv";
import axios from "axios";
import Youtube from "youtube-node";

dotenv.config();

const youtube = new Youtube();
youtube.setKey(process.env.YOUTUBE_KEY);


export const getMusic = async (req, res) => {
    const music = req.query.music;
    console.log('getMusic :: ', music);
    await Result.find({ music: music }, (err, data) => {
      if(err) {
        return res.status(500).json({
          success: false,
          msg: 'DB_ERROR'
        });
      }
      console.log(`result(${data.length}개):`, data);
      try {
        
        if( data.length == 0 ) {
          console.log('no data');
          return res.status(204);
        }
    
        return res.status(200).json({
          success: true,
          data: {
            music: music,
            url: data[0].url,
            title: data[0].title,
            image: data[0].image
          }
        });
      } catch(e) {
        console.log(e);
      }
    });
};


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


export const searchLastFMMusic = async (req, res, next) => {
    var word = encodeURI(req.query.keyword);
    console.log("Last.FM API 검색어 : ", req.query.keyword);
    var url = `http://ws.audioscrobbler.com/2.0/?method=track.search\
                &track=${word}\
                &api_key=${process.env.LASTFM_KEY}\
                &limit=${process.env.SEARCH_LIMIT}\
                &format=json`;
    await axios({
      method: "get",
      url: url,
      responseType: 'json'
    }).then((musicList) => {
      const track = musicList.data.results.trackmatches.track;
      var list = [];
      console.log('===========');
      for(var i in track) {
        var url = track[i].url;
        var title = track[i].name;
        var artist = track[i].artist;
        var image = track[i].image[1]['#text'];
       
        console.log('url:',url);
        console.log('이름:', title);
        console.log('아티스트:', artist);
        console.log('이미지:', image);
  
        list.push({
          url: url,
          title: title,
          artist: artist,
          image: image
        });
        console.log('--------')
      }
      return res.status(200).json({
        success: true,
        data: list
      });
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        msg: 'INTERNAL_SERVER_ERROR'
      });
    });
};

export const searchDaumMusic = async(req, res) => {
    var url = 'https://dapi.kakao.com/v2/search/vclip';
    var query = encodeURI(req.query.keyword);
    var headers = { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` }
    var size = `${process.env.SEARCH_LIMIT}`;
    console.log(`검색어 : ${req.query.keyword}`);
    await axios({
      method: "get",
      url: url+`?query=${query}&size=${size}`,
      responseType: 'json',
      headers: headers
    }).then((response) => {
      const docs = response.data.documents;
      var list = [];
      for(var i in docs) {
        var obj = {};
        var music = docs[i].url.split('?v=')[1];
        if( music == '' || music == null ) { continue; }
        obj.image = docs[i].thumbnail;
        obj.title = docs[i].title;
        obj.url = docs[i].url;
        obj.music = music;
        list.push(obj);
        
      }
      console.log(list);
      return res.status(200).json({
        success: true,
        data: list
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: 'INTERNAL_SERVER_ERROR'
      });
    });
}


export const findRandomMusic = async (req, res, next) => {
    console.log(req.body);
    const {
      body: { result },
    } = req;
    // validate
    try {
      if (!result.match(/^[01]{11}$/)) {
        console.log("잘못된 result 값 : " + result);
        throw new Error();
      }
    } catch(err) {
      return res.status(400).json({ 
        success: false,
        msg: "BAD_REQUEST" 
      });
    }
  
    let resultArrayOrigin = result.split("");
    let resultArray;
    let searchedResultArray; // 해당 결과와 동일한 결과를 가진 결과 도큐먼트의 Array
    let randomMusic;
  
    try {
      // 전체 일치 하는 경우
      searchedResultArray = await Result.find({ result });
      if (searchedResultArray.length > 0) {
        console.log(searchedResultArray);
        randomMusic = getRandomMusicFromResults(searchedResultArray);
        console.log("결과값 전체 일치 find", randomMusic);
        req.body.randomMusic = randomMusic;
        next();
        return;
      }
  
      // 하나 다를 경우 (90.90%)
      let randomIndexArray = getDifferentOneIndexArray();
      for (let i = 0; i < randomIndexArray.length; i++) {
        //해당 인덱스 수정
        resultArray = resultArrayOrigin.slice();
        resultArray[randomIndexArray[i]] =
          resultArray[randomIndexArray[i]] == 0 ? 1 : 0;
        let resultString = resultArray.join("");
        searchedResultArray = await Result.find({ result: resultString });
        // 결과값 찾으면 전송할 데이터의 randomMusic에 해당 값을 넣는다.
        if (searchedResultArray.length > 0) {
          randomMusic = getRandomMusicFromResults(searchedResultArray);
          console.log("결과값 하나 다른 경우 find", randomMusic);
          console.log("원본\t:" + resultArrayOrigin.join(""));
          console.log("비교\t:" + resultArray.join(""));
          req.body.randomMusic = randomMusic;
          next();
          return;
        }
      }
  
      // 두개 다를 경우 (81.81%)
      randomIndexArray = getDifferentTwoIndexArray();
      for (let i = 0; i < randomIndexArray.length; i++) {
        resultArray = resultArrayOrigin.slice();
        let indexToFix = randomIndexArray[i]; // [m, n];
        resultArray[indexToFix[0]] = resultArray[indexToFix[0]] == 0 ? 1 : 0;
        resultArray[indexToFix[1]] = resultArray[indexToFix[1]] == 0 ? 1 : 0;
        let resultString = resultArray.join("");
        searchedResultArray = await Result.find({ result: resultString });
        if (searchedResultArray.length > 0) {
          randomMusic = getRandomMusicFromResults(searchedResultArray);
          req.body.randomMusic = randomMusic;
          console.log("결과값 두개 다른 경우 find", randomMusic);
          console.log("원본\t:" + resultArrayOrigin.join(""));
          console.log("비교\t:" + resultArray.join(""));
          next();
          return;
        }
      }
  
      
      // 세개 다를 경우 (72.72%)
      randomIndexArray = getDifferentThreeIndexArray();
      for (let i = 0; i < randomIndexArray.length; i++) {
        resultArray = resultArrayOrigin.slice();
        let indexToFix = randomIndexArray[i]; // [m, n, o];
        resultArray[indexToFix[0]] = resultArray[indexToFix[0]] == 0 ? 1 : 0;
        resultArray[indexToFix[1]] = resultArray[indexToFix[1]] == 0 ? 1 : 0;
        resultArray[indexToFix[2]] = resultArray[indexToFix[2]] == 0 ? 1 : 0;
  
        let resultString = resultArray.join("");
        searchedResultArray = await Result.find({ result: resultString });
  
        if (searchedResultArray.length > 0) {
          randomMusic = getRandomMusicFromResults(searchedResultArray);
          req.body.randomMusic = randomMusic;
          console.log("결과값 세개 다른 경우 find", randomMusic);
          console.log("원본\t:" + resultArrayOrigin.join(""));
          console.log("비교\t:" + resultArray.join(""));
          next();
          return;
        }
      }
      
      //IF NOT?
      randomMusic = await Result.aggregate([{ $sample: { size:1 } }]);
      if( randomMusic.length == 0 ) {
        req.body.randomMusic = req.body;
        next();
        return;
        // throw new Error();
      }
      req.body.randomMusic = randomMusic[0];
      console.log("72% 이상 일치 하는 결과 없음 - Random Music", randomMusic[0]);
      next();
      return;
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: "INTERNAL_SERVER_ERROR"
      });
    }
};

const shuffle = array => {
    var j, x, i;
    for (i = array.length; i; i -= 1) {
      j = Math.floor(Math.random() * i);
      x = array[i - 1];
      array[i - 1] = array[j];
      array[j] = x;
    }
};
  
const getRandomMusicFromResults = array => {
    let length = array.length;
    let randomIndex = Math.floor(Math.random() * length);
    console.log('randomIndex',randomIndex);
    return array && array[randomIndex];
};
  
const getDifferentOneIndexArray = () => {
    let arr = [];
    for (let i = 0; i < 11; i++) {
      arr.push(i);
    }
    shuffle(arr);
    return arr;
};
  
const getDifferentTwoIndexArray = () => {
    let arr = [];
    for (let i = 0; i < 11; i++) {
      for (let j = i + 1; j < 11; j++) {
        arr.push([i, j]);
      }
    }
    shuffle(arr);
    return arr;
};
  
const getDifferentThreeIndexArray = () => {
    let arr = [];
    for (let i = 0; i < 11; i++) {
      for (let j = i + 1; j < 11; j++) {
        for (let k = j + 1; k < 11; k++) {
          arr.push([i, j, k]);
        }
      }
    }
    shuffle(arr);
    return arr;
};