const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const { User } = require('./models/Users');
const config = require('./config/key');
const path = require('path');

const app = express();
const initializePassport = require('./passportConfig');

initializePassport(passport);

app.set('view-engine', 'ejs');
app.set('views', path.join(__dirname, '../client/src/views'));

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET || 'asdrqw!@#',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const user = new User(req.body);

    user.save((err, userInfo) => {
      if (err) return res.json({ succesee: false, err });
      return res.status(200).json({
        succesee: true
      });
    });
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.get('/logout', (req, res) => {
  req.logout();
  req.session.save((err) => {
    if (err) throw err;
    res.redirect('/');
  });
  res.status(200).json({ logout: 'success' });
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

// DB 연결
const mongoose = require('mongoose');

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => { console.log('MongoDB Connected...') })
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`Server started on PORT ${PORT}`) });