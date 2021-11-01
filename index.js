const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { response } = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle ware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ygqbm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travelSite');
        const servicesCollection = database.collection('services');

        // GET API
        app.get('/services',async(req,res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('travel node js server')
})

app.listen(port, () => {
    console.log('Running travel server on port',port);
})