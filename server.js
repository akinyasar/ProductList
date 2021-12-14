const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const connectionString = 'mongodb+srv://akiny:akiny@database.3d3qk.mongodb.net/database?retryWrites=true&w=majority';
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {

        console.log('Connected to Database');
        const db = client.db('database');
        const productsCollection = db.collection('products')
        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())

        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            if (req.method === 'OPTIONS') {
                res.header('Access-Control-Allow-Methods',
                    'PUT, POST, PATCH, DELETE, GET'
                );
                return res.status(200).json({});
            }
            next();
        });

        app.get('/', (req, res) => {

            db.collection('products').find().toArray()
                .then(results => {
                    let temp = results
                    res.send(temp)
                })
                .catch(error => console.error(error))

        });

        app.post('/', (req, res) => {
            var item = {
                name: req.body.name,
                price: req.body.price
            };
            productsCollection.insertOne(item)
                .then(result => {

                })
                .catch(error => console.error(error));
        });


        app.put('/', (req, res) => {
            productsCollection.findOneAndUpdate({ _id: ObjectID(req.body._id) },
                {
                    $set: {
                        name: req.body.name,
                        price: req.body.price
                    }
                }
            )
                .then(result => {
                })
                .catch(err => console.error(err))
        });

        app.delete('/', (req, res) => {
            productsCollection.deleteOne(
                { _id: ObjectID(req.body._id) }
            )
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('Silinecek ürün bulunamadı')
                    }
                })
                .catch(error => console.error(error))
        })

        app.listen(3000, function () {
            console.log('listening on 3000');
        });

    })
    .catch(error => console.error(error));






