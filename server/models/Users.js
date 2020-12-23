const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 30
  },
  email: {
    type: String,
    trim: true, // 공백 제거
    unique: 1 //중복 방지
  },
  password: {
    type: String,
    minlength: 5
  },

});

userSchema.pre('save', function (next) {
  let user = this;
  // isModified([path])
  // 수정이 발생할 때만 동작
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        // Store hash in your password DB.
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// 비밀번호 비교 메서드 생성
userSchema.methods.comparePassword = async function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    console.log('Compare password :', isMatch);
    if (err) return cb(err);
    cb(null, isMatch);
  });
}


const User = mongoose.model('User', userSchema);
module.exports = { User };