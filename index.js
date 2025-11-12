const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.jkfjkqt.mongodb.net/?appName=Cluster1`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // await client.connect();

        const db = client.db("movie_db")
        const moviesCollection = db.collection("movies")


        // api add
        app.post('/movies/add', async (req, res) => {
            const newProduct = req.body;
            const result = await moviesCollection.insertOne(newProduct)
            res.send(result)
        })


        // latest-movie

        app.get('/top-rating-movies', async (req, res) => {
            const cursor = moviesCollection.find().sort({ rating: -1 }).limit(6);
            const result = await cursor.toArray()
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

        // find one data
        app.get('/movies/:id', async (req, res) => {
            const id = req.params.id;
            const quarry = { _id: new ObjectId(id) }
            const result = await moviesCollection.findOne(quarry)
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

        // await client.db("admin").command({ ping: 1 });
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