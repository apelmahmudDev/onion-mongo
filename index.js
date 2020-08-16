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
app.get('/foods', (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const collection = client.db("FoodStore").collection("foods");
    collection.find().toArray((err, documents) => {
        if(err){
          console.log('This is error', err);
        }
        else{
          res.send(documents);
        }
        client.close();
    })
  });
})

//Daynamic foods
app.get('/food/:key', async(req, res) => {
  const key = req.params.key;

  client = await MongoClient.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  });
  const db = client.db('FoodStore');
  const items = await db.collection('foods').find({key}).toArray();
  res.send(items[0]);
  client.close();
})


//POST
app.post('/addFood', (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const person = req.body;
    
    client.connect(err => {
      const collection = client.db("FoodStore").collection("foods");
      collection.insert(person, (err, result) => {
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