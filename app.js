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
const authRouter = require ('./routes/authRouter.js');
const cors = require('cors');
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
const homeRouter = require('./routes/home');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');




// ✅ Place CORS avant les routes et autres middlewares
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




// Default route
app.get('/', (req, res) => {
  res.send('signin');
});

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