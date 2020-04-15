const express = require('express');
const app = express();
app.use(express.json());
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

  app.get('/check', (req, res) => {
    let valid = false
    let usernames = []
    //console.log('count', counter);
    //console.log(req.body);
    // this should be a mongo find
    db.collection('Users')
      .find({ username: req.query.username, password: req.query.password }, { $exists: true })
      .toArray()
      .then((docs) => {
        console.log(docs)
        docs.map(data => {
          usernames.push(data.username)
        })
        if (usernames.length === 0) {
          res.send({
            valid,
          })
        }
        else {
          valid = true
          res.send({ valid })
        }
      })
      .catch((e) => {
        console.log('invalid')
        res.send({ valid });
      });
  });

  app.get('/insertAcc', (req, res) => {
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

        if (!usernames.includes(req.query.username)) {
          db.collection('Users')
            .insert({
              username: req.query.username,
              password: req.query.password
            })
            .then(() => {
              valid = true
              res.send({ valid })
              //res.send('Insert Ok')
            })
            .catch((e) => {
              console.log(e)
              //res.send('Error');
              res.send({ valid })
            })
        }
        else {
          res.send({ valid })
        }
      })


  });

  http.listen(port, () => console.log(`Listening on port ${port}!`))
})