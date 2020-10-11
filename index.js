const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const password = "S8BZq5XmJvXyvq9";
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = "mongodb+srv://practicebymeUser:S8BZq5XmJvXyvq9@practice-by-me.dtava.mongodb.net/practicebymeDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });


client.connect(err => {
    const collection = client.db("practicebymeDB").collection("practice");
 
//get
    app.get("/about", (req, res) => {
        collection.find({})
        .toArray((err, documents) => {
            res.send(documents);   
        });
    }); 

//post
    app.post("/aboutMe", (req, res) => {
        const about = req.body;
        collection.insertOne(about)
        .then(result =>{
            res.redirect("/");
        });

    });
    
//delete 

    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({_id: ObjectID(req.params.id)})
        .then((documents) =>{
            res.send(documents.deletedCount > 0);
        });
    });

//get dynamic user with ID for update details
    app.get('/user/:id', (req, res) =>{
        collection.find({_id: ObjectID(req.params.id)})
        .toArray((err, documents) =>{
            res.send(documents[0]);
        });
    });
// patch for update
    app.patch('/update/:id', (req, res) =>{
        collection.updateOne({_id: ObjectID(req.params.id)},
        {
            $set:{age:req.body.age, job:req.body.job}
        }
        ).then(result => res.send(result.matchedCount > 0));
    });
});

app.listen(3000, () => console.log(`Listening to port 3000`));