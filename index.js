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
        const usersCollection = db.collection("users");

        // users api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const email = req.body.email
            const query = { email: email }
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                res.send({ notification: 'user already exits .do not need to insert again' })
            }
            else {
                const result = await usersCollection.insertOne(newUser)
                res.send(result)
            }
        })

        // users get
        app.get('/users', async (req, res) => {
            const users = await usersCollection.find({}).toArray();
            res.send(users);
        });


        // api add
        app.post('/movies/add', async (req, res) => {
            const newProduct = req.body;
            const result = await moviesCollection.insertOne(newProduct)
            res.send(result)
        })

        // get movies added by users
        app.get('/movies/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { addedBy: email };
            const result = await moviesCollection.find(query).toArray()
            res.send(result)
        })

        // top rated
        app.get('/movies/top-rating-movies', async (req, res) => {
            const { minRating, maxRating } = req.query;

            let query = {};


            if (minRating || maxRating) {
                query.rating = {};
                if (minRating) query.rating.$gte = parseFloat(minRating);
                if (maxRating) query.rating.$lte = parseFloat(maxRating);
            }

            const cursor = moviesCollection
                .find(query)
                .sort({ rating: -1 })
                .limit(5);
            const result = await cursor.toArray();
            res.send(result);
        });


        // recently added
        app.get('/movies/recently-added-movies', async (req, res) => {
            const { genres, minRating, maxRating } = req.query;

            let query = {};

            // genres filter
            if (genres) {
                const genreArray = genres.split(',');
                query.genre = { $in: genreArray };
            }

            // rating filter
            if (minRating || maxRating) {
                const ratingFilter = {};
                const min = parseFloat(minRating);
                const max = parseFloat(maxRating);

                if (!isNaN(min)) ratingFilter.$gte = min;
                if (!isNaN(max)) ratingFilter.$lte = max;

                // Only add to query if valid
                if (Object.keys(ratingFilter).length > 0) {
                    query.rating = ratingFilter;
                }
            }

            try {
                const cursor = moviesCollection
                    .find(query)
                    .sort({ releaseYear: -1 })
                    .limit(6);

                const result = await cursor.toArray();
                res.send(result);
            } catch (err) {
                console.error(err);
                res.status(500).send({ error: "Server error" });
            }
        });






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
        app.put('/movies/:id', async (req, res) => {
            const id = req.params.id;
            const updatedMovie = req.body;

            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    title: updatedMovie.title,
                    genre: updatedMovie.genre,
                    releaseYear: updatedMovie.releaseYear,
                    director: updatedMovie.director,
                    cast: updatedMovie.cast,
                    rating: updatedMovie.rating,
                    duration: updatedMovie.duration,
                    plotSummary: updatedMovie.plotSummary,
                    posterUrl: updatedMovie.posterUrl,
                    language: updatedMovie.language,
                    country: updatedMovie.country,
                    addedBy: updatedMovie.addedBy
                },
            };

            const result = await moviesCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

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