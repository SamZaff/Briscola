const md5 = require('md5')
const express = require('express');
const app = express.Router();
const { MongoClient } = require('mongodb');

//Connection URL
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';

//Database
let dbName = 'CardGame'
if(process.env.NODE_ENV === 'production'){
  dbName = 'heroku_3wlr8ghk'
}


const client = new MongoClient(url);

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
    // this should be a mongo find
    db.collection('Users')
      .find({ username: req.body.username, password: md5(req.body.password+'_'+req.body.username) }, { $exists: true })
      .toArray()
      .then((docs) => {
        console.log(docs)
        docs.map(data => {
          usernames.push(data.username)
        })
        if (usernames.length !== 0) {
          valid = true
        }
        res.send({valid, color: data.color})
      })
      .catch((e) => {
        console.log('invalid')
        res.send({ valid });
      });
  });

  app.post('/insertAcc', (req, res) => {
    console.log('USERNAME:' + req.query.username)
    let valid = false;
    let usernames = []
    // console.log(req)
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
              password: md5(req.body.password+'_'+req.body.username),
              color: req.body.color
            })
            .then(() => {
              valid = true
              res.send({valid})
            })
            .catch((e) => {
              console.log(e)
              
              res.redirect('../')
            })
        }
        else {
          res.send({valid})
        }
      })

  });

})

module.exports = app
