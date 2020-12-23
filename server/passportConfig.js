const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./models/Users');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    console.log('LocalStrategy :', email, password);

    User.findOne({ email: email }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      try {
        user.comparePassword(password, (err, isMatch) => {
          if (!isMatch) {
            console.log('isMatch Fail');
            return done(null, false, { message: 'Password incorrect' });
          } else {
            console.log('isMatch Success');
            return done(null, user); //serializeUser 첫 번째 인자로 넘어감
          }
        });
      } catch (error) {
        return done(error);
      }
    });
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => {
    console.log('serializeUser', user.id);
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    console.log('deserializeUser', id);
    User.findById(id, function (err, user) { // 여기의 user가 req.user가 됨
      return done(err, user);
    });
  });
}

module.exports = initialize