const express = require('express')
const cors = require("cors");
require("dotenv").config();
const app = express()
const port = 5000
app.use(express.json());
app.use(cors());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pwifs1n.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const manavApp_job_task = client.db("manavApp_job_task")
    const userCollection = manavApp_job_task.collection("usersData")

    app.post("/userRegister", async (req, res) => {
      const body = req.body;
      console.log(body);
      const result = await userCollection.insertOne(body);
      if(result?.insertedId){
        return res.status(200).send(result);
      }else {
        return res.status(404).send({
          message: "can not insert try again leter",
          status: false,
        });
      }
    })

    app.get('/', (req, res) => {
      res.send('Hello World!')
    })
    
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})