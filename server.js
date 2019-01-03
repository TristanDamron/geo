const express = require('express')
const app = express()
const pg = require('pg')
const path = require('path')
const db = require('./db');
const PORT = process.env.PORT || 5000
const URI = process.env.DATABASE_URL

let database = new db();

var client = null;

database.connectToDatabase();

app.use(express.static(path.join(__dirname, 'img')))

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/validate', function(req, res) {  
  database.getURI(req.query.uri, req.query.tablename)
    .then(response => {
      if (response === undefined) {
        database.createNewApp(req.query.uri, req.query.tablename)  
      }      
      database.getAppId(req.query.uri, req.query.tablename)
        .then (id => {
          res.redirect('/collector/' + id.appid);
        })
        .catch (err => {
          console.error(error);
        })      
    })  
    .catch (error => {
      console.error(error);
    })  
})

app.get('/collector/:appid', (req, res) => {
  res.render('collector')
})

app.get('/about', (req, res) => {
  res.render('about')
})
    
app.listen(PORT, function () {
  console.log('Listening...')
})