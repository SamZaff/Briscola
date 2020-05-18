const md5 = require('md5')
const express = require('express');
const app = express();
app.use(express.json());
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true}))
const { MongoClient, ObjectID } = require('mongodb');


//Connection URL
const url = 'mongodb://localhost:27017';

//Database
const dbName = 'CardGame'

const client = new MongoClient(url);

const port = 3002;
var http = require('http').Server(app);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// app.get('/', function(req, res, next) {
//   // Handle the get for this route
// });

// app.post('/', function(req, res, next) {
//  // Handle the post for this route
// });

client.connect((err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Connected successfully to server");
  const db = client.db(dbName);

  app.post('/check', (req, res) => {

    let valid = false
    let usernames = []
    //console.log('count', counter);
    //console.log(req.body);
    // this should be a mongo find
    db.collection('Users')
      .find({ username: req.body.username, password: md5(req.body.password) }, { $exists: true })
      .toArray()
      .then((docs) => {
        console.log(docs)
        docs.map(data => {
          usernames.push(data.username)
        })
        if (usernames.length === 0) {
          res.redirect('../')
        }
        else {
          valid = true
          res.redirect('../Rooms')
        }
      })
      .catch((e) => {
        console.log('invalid')
        res.send({ valid });
      });
  });

  app.post('/insertAcc', (req, res) => {
    let valid = false;
    let usernames = []

    db.collection('Users')
      .find({}, { projection: { _id: 0 } })
      .toArray()
      .then((docs) => {
        console.log(docs)
        docs.map(data => {
          usernames.push(data.username)

        })
        console.log(usernames)
        console.log(docs)

        if (!usernames.includes(req.body.username)) {
          db.collection('Users')
            .insert({
              username: req.body.username,
              password: md5(req.body.password)
            })
            .then(() => {
              valid = true
              res.redirect('../Rooms')
              //res.send('Insert Ok')
            })
            .catch((e) => {
              console.log(e)
              //res.send('Error');
              
              res.redirect('../')
            })
        }
        else {
          res.redirect('../')
        }
      })


  });

  http.listen(port, () => console.log(`Listening on port ${port}!`))
})