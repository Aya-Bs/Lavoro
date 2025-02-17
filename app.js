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
const MongoStore = require('connect-mongo');

const authRouter = require ('./routes/authRouter.js');
const cors = require('cors');



const flash = require('connect-flash');



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
const adminRouter = require('./routes/admin');


const app = express();


app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());



// app.use((req, res, next) => {
//   res.locals.successMessage = req.flash('success');
//   res.locals.errorMessage = req.flash('error');
//   next();
// });

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');





//Place CORS avant les routes et autres middlewares
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

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

app.use('/', homeRouter);
app.use('/auth',authRouter);
app.use('/admin',adminRouter);


// Home route
app.get('/home', (req, res) => {
  console.log('Session:', req.session); // Log the session data

  // Check if the user is authenticated
  if (!req.session.user) {
    console.log('User not authenticated. Redirecting to sign-in page.');
    return res.redirect('/users/signin');
  }

  // Render the home page for authenticated users
  res.render('home', { user: req.session.user });
});

// Test email route
// app.get('/test-email', async (req, res) => {
//     try {
//       const mailOptions = {
//         to: 'test@example.com', // Optional: Use a placeholder email
//         from: `Your App Name <${process.env.EMAIL_USER}>`, // Sender name and email
//         subject: 'Test Email',
//         text: 'This is a test email from your application.',
//       };
  
//       await transporter.sendMail(mailOptions);
//       res.send('Test email sent successfully! Check your Mailtrap inbox.');
//     } catch (error) {
//       console.error('Error sending test email:', error);
//       res.status(500).send('Error sending test email.');
//     }
//   });

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