import mongoose from 'mongoose';

const visitorSchema = mongoose.Schema({
    regDt: Date
});

const Visitor = mongoose.model('Visitor', visitorSchema);
module.exports = { Visitor };