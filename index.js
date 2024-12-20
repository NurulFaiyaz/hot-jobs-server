const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



const app = express()
const port = process.env.PORT || 8800;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uw2at.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // job related Apis
        const jobsCollection = client.db('hot_Jobs').collection('jobs')
        const jobApplicationsCollection = client.db('hot_Jobs').collection('job_applications')

        app.get('/jobs', async (req, res) => {
            const cursor = jobsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id
            const cursor = { _id: new ObjectId(id) }
            const result = await jobsCollection.findOne(cursor)
            res.send(result)
        })
        // job applications related apis

        app.post('/job-applications', async (req, res) => {
            const application = req.body;
            const result = await jobApplicationsCollection.insertOne(application)
            res.send(result)
        })



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hot jobs is falling from the sky')
})

app.listen(port, () => {
    console.log(`Hot Jobs server in running at port ${port}`)
})