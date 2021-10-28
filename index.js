const express = require('express')
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const corse = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eeiu8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// middleware 
app.use(corse())
app.use(express.json())


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection('services');

        // get api 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)


        })

        // get single service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            console.log('getting specific id', id)
            const query = { _id: objectId(id) }
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })



        // post api 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service)
            const result = await servicesCollection.insertOne(service);
            res.send(result)

        })

        // delete api 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: objectId(id) }
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius server')
});
app.listen(port, () => {
    console.log('running genius server on port', port)
})