const mongoose = require('mongoose')

const Schema = mongoose.Schema

let eventSchema = new Schema({
  userId: { type: Number, required: true, unique: true},
  start: { type: String, required: true },
  title: { type: String, required: true},
  end: { type: String, required: true}
})

let UserModel = mongoose.model('Evento', eventSchema)

module.exports = UserModel
