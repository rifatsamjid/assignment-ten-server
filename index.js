const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(cors())
app.use(express.json())

// moviesdb
// 3Ps4YlSfRc0AID3u


const uri = "mongodb+srv://moviesdb:3Ps4YlSfRc0AID3u@cluster1.jkfjkqt.mongodb.net/?appName=Cluster1";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        await client.connect();

        const db = client.db("movie_db")
        const moviesCollection = db.collection("movies")


        
         app.post('/movies', async (req, res) => {
            const newProduct = req.body;
            const result = await moviesCollection.insertOne(newProduct)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    finally {

    }

}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send("assignment ten server is running")
})

app.listen(port, () => {
    console.log(`Assignment ten running port:${port}`)
})