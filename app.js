require('dotenv').config()
const { ObjectId } = require('mongodb')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;  
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');


//nb3amjtQWhSN6ibH

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

async function cxnDB(){

  try{
    client.connect; 
    const collection = client.db("QuebecCISGameTime").collection("fav_game");
    // const collection = client.db("papa").collection("dev-profiles");
    const result = await collection.find().toArray();
    //const result = await collection.findOne(); 
    console.log("cxnDB result: ", result);
    return result; 
  }
  catch(e){
      console.log(e)
  }
  finally{
    client.close; 
  }
}


app.get('/', async (req, res) => {

  let result = await cxnDB().catch(console.error); 

  // console.log("get/: ", result);

  res.render('index', {  gameData : result })
})

//CREATE

app.get('/create', async (req, res) => {

  //get data from the form 

  console.log("in get to slash update:", req.query.ejsFormName); 
  game_input = req.query.ejsFormName; 

  //update in the database. 
  client.connect; 
  const collection = client.db("QuebecCISGameTime").collection("fav_game");
  await collection.insertOne({ 
    game: game_input
})

})

//READ

app.get('/mongo', async (req, res) => {

  // res.send("check your node console, bro");

  let result = await cxnDB().catch(console.error); 

  console.log('in get to slash mongo', result[1].animal_name); 

  res.send(`here ya go, joe. ${ result[1].animal_name }` ); 

})

//UPDATE

app.post('/updateGame/:id', async (req, res) => {

  try {
    console.log("req.parms.id: ", req.params.id) 
    
    client.connect; 
    const collection = client.db("QuebecCISGameTime").collection("fav_game");
    let result = await collection.findOneAndUpdate(
      {"_id": new ObjectId(req.params.id)}, {$set:{game : "Halo"}})
    .then(result => {
      console.log(result); 
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally{
    //client.close()
  }

})

// DELETE

app.post('/deleteGame/:id', async (req, res) => {

  try {
    console.log("req.parms.id: ", req.params.id) 
    
    client.connect; 
    const collection = client.db("QuebecCISGameTime").collection("fav_game");
    let result = await collection.findOneAndDelete( 
      {"_id": new ObjectId(req.params.id)}, {$set:{game : ""}})
    
    .then(result => {
      console.log(result); 
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally{
    //client.close()
  }

})


console.log('in the node console');

app.listen(PORT, () => {
  console.log(`Example app listening on port ${ PORT }`)
})