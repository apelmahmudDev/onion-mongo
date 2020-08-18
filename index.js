const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;

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
  client = await MongoClient.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  });
  const key = req.params.key;

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

//Place Order
app.post('/placeOrder', (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const orderDetails = req.body;
  orderDetails.ordertTime = new Date();
  console.log(orderDetails);

    client.connect(err => {
      const collection = client.db("FoodStore").collection("orders");
      collection.insertOne(orderDetails, (err, result) => {
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

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening to port 8080'));