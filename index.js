const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;
const port = process.env.DB_PORT || 4200;

let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//GET
app.get('/persons', (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const collection = client.db("onlineUser").collection("user");
    collection.find().toArray((err, document) => {
        if(err){
          console.log('This is error', err);
        }
        else{
          res.send(document);
        }
        client.close();
    })
  });
})

//POST
app.post('/addPerson', (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const person = req.body;
    
    client.connect(err => {
      const collection = client.db("onlineUser").collection("user");
      collection.insertOne(person, (err, result) => {
          if(err){
            console.log('This is error', err);
            res.status(500).send({message:err});
          }
          else{
            res.send(result.ops[0]);
          }
          client.close();
      })
    });
})

app.listen(port, () => console.log('Listening to  port 4200'));