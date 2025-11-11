const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


        // api add
        app.post('/movies', async (req, res) => {
            const newProduct = req.body;
            const result = await moviesCollection.insertOne(newProduct)
            res.send(result)
        })

        // api delete
        app.delete('/movies/:id', async (req, res) => {
            const id = req.params.id;
            const quarry = { _id: new ObjectId(id) }
            const result = await moviesCollection.deleteOne(quarry)
            res.send(result)
        })

        // app get
        app.get('/movies', async (req, res) => {
            const cursor = moviesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // update
        app.patch('/movies/:id', async (req, res) => {
            const id = req.params.id;
            const updateMovies = req.body;
            const query = { _id: new ObjectId(id) }

            const update = {
                $set: {
                    name: updateMovies.name,
                    price: updateMovies.price
                }
            }
            const result = await moviesCollection.updateOne(query, update)
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