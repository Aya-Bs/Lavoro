require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongo = require('mongoose');
const http = require('http');
const bodyparser = require('body-parser');
const db = require('./config/dbConnection.json');
const session = require('express-session');
const transporter = require('./middleware/emailConfig'); // Import the transporter from middleware
const MongoStore = require('connect-mongo');

// Connect to MongoDB
mongo
  .connect(db.url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const usersRouter = require('./routes/users');
const profileRouter = require('./routes/profile');
const homeRouter = require('./routes/home');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a secure secret key
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: db.url, // MongoDB connection URL
      ttl: 24 * 60 * 60, // Session TTL (1 day)
    }),
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'lax', // Prevent CSRF attacks
    },
  })
);

// Routes
app.use('/users', usersRouter);
app.use('/profiles', profileRouter);
app.use('/', homeRouter);



// // Middleware to redirect authenticated users away from signin/signup pages
// function redirectIfAuthenticated(req, res, next) {
//   if (req.session.user) {
//     console.log('User already signed in. Redirecting to home.');
//     return res.redirect('/home'); // Redirect to home if user is already authenticated
//   }
//   next(); // Continue to signin/signup if not authenticated
// }

// // Apply the middleware to the signin and signup routes
// app.get('/users/signin', redirectIfAuthenticated, (req, res) => {
//   res.render('signin');
// });

// app.get('/users/signup', redirectIfAuthenticated, (req, res) => {
//   res.render('signup');
// });




// Error handling
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Create server
const server = http.createServer(app);

// Start server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});