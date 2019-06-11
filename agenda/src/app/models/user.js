const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  local: {
    email: String,
    password: String
  },
  facebook: {
    email: String,
    password: String,
    id: String,
    token: String
  },
  twitter: {
    email: String,
    password: String,
    id: String,
    token: String
  }
});

// const eventSchema = new mongoose.Schema({
//     userId: { type: Number, required: true },
//     start: { type: String, required: true},
//     title: { type: String, required: true},
//     end: { type: String}
// });

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);
//module.exports = mongoose.model('Eventos', eventSchema);
