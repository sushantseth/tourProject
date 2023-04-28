
const mongoose = require('mongoose')


const counterSchema = mongoose.Schema({
    count : Number,
    name : String
})


const Counter = mongoose.model('Counter',counterSchema)

module.exports = Counter;
