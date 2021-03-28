import mongoose from 'mongoose';

const answerSchema = mongoose.Schema({
    musicId: String,
    answer: String,
    regDt: Date
});

const Answer = mongoose.model('Answer', answerSchema);
module.exports = { Answer };