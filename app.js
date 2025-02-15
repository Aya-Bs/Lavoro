var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./src/config/dbConnection.json');
const mongo = require('mongoose');
const http = require('http');
mongo.connect(db.url).then(()=> {
  console.log('Connected to the database');
}
).catch((err) => {
  console.log('Cannot connect to the database', err);
})



const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/' , (req, res) => {
  res.send('Hello World');
});
const server = http.createServer(app,console.log('Server is running on port 3001'));


server.listen(3009);

module.exports = app;