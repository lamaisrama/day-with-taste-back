import routes from "../routes";
import UserService from "../services/userService";
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
    }

}