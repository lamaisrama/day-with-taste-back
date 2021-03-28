import routes from "../routes";
import { Answer } from "../models/answer";
import { Visitor } from "../models/visitor";

module.exports = {
    visitHome:  async(req, res, next) => {       
       const visitor = new Visitor({regDt: new Date()});
       console.log('visit ::',visitor);
       visitor.save((err, response) => {
           if(err) {
               console.log('❌visit err',err);
               return res.json({success: false, err});
            }
           console.log('✅visit success');
           return res.status(200).json({success: true});
       });
    },
    submitAnswer: async(req, res, next) => {
        console.log(req.body);
        const answer = new Answer(req.body);
        answer.regDt = new Date();
        console.log('answer ::', answer);
        answer.save((err, response) => {
            if(err) {
                console.log('❌submit err', err);
                return res.json({success: false}, err);
            }
            console.log('✅submit success');


            /*
            Answer.find({answer: answer.answer}, (err, result) => {
                if(err) {
                    console.log('❌result err', err);
                    return res.json({success: false}, err);
                }

                if(result.length==0) {
                    // 일치율 낮춰서 재전송
                }
                console.log('✅result success');
                return res.status(200).json(result);
            })
            */

            return res.status(200).json(response);
        });
    }
}
