const express = require("express")
const cors = require("cors")
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()

// Blood_Donation
// i77bnUTlSB142x3G

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.62b40ek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const database = client.db("blood_donation")
        const blogCollection = database.collection("blogs")
        const donationRequestCollection = database.collection("donation-request")
        const userCollection = database.collection("users")

        app.post("/users", async (req, res) => {
            const user = req.body;

            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query)
            if (existingUser) {
                return res.send({ message: "user already exists", insertedId: null })
            }
            const result = await userCollection.insertOne(user)
            res.send(result)
        });

        app.get("/users", async (req, res) => {
            const query = {}
            const result = await userCollection.find(query).toArray()
            res.send(result)
        });

        app.get("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(query)
            res.send(result)
        });

        app.get("/user",async(req,res)=>{
            const email = req.query.email;
            const query = { email: email }
            const result=await userCollection.findOne(query)
            res.send(result)
        })

        app.put("/users-role/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }

            const userStatus = {
                $set: {
                    role: "Admin"
                }
            }

            const result = await userCollection.updateOne(query, userStatus, options)
            res.send(result)
        });

        app.put("/users-block/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }

            const userStatus = {
                $set: {
                    status: "blocked"
                }
            }

            const result = await userCollection.updateOne(query, userStatus, options)
            res.send(result)
        });
        app.put("/users-unblock/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }

            const userStatus = {
                $set: {
                    status: "active"
                }
            }

            const result = await userCollection.updateOne(query, userStatus, options)
            res.send(result)
        });

        app.get("/blog", async (req, res) => {
            const cursor = blogCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        });
        app.get("/blog/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await blogCollection.findOne(query)
            res.send(result)
        });

        app.post('/donation-request', async (req, res) => {
            const donationRequest = req.body;
            const result = await donationRequestCollection.insertOne(donationRequest)
            res.send(result)

        });

        app.get("/all-donation-request", async (req, res) => {
            const query = {}
            const result = await donationRequestCollection.find(query).toArray()
            res.send(result)
        });

        app.get("/donation-request", async (req, res) => {
            const query = { status: "pending" }
            const result = await donationRequestCollection.find(query).toArray()
            res.send(result)
        });



        app.get("/donation-request-details/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await donationRequestCollection.findOne(query)
            res.send(result)
        });

        app.put("/donation-request-details/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }

            const donationRequest = {
                $set: {
                    status: "inprogress"
                }
            }

            const result = await donationRequestCollection.updateOne(query, donationRequest, options)
            res.send(result)
        });
        app.put("/donation-request-done/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }

            const donationRequest = {
                $set: {
                    status: "done"
                }
            }

            const result = await donationRequestCollection.updateOne(query, donationRequest, options)
            res.send(result)
        });
        app.put("/donation-request-pending/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }

            const donationRequest = {
                $set: {
                    status: "pending"
                }
            }

            const result = await donationRequestCollection.updateOne(query, donationRequest, options)
            res.send(result)
        });
        app.put("/donation-request-cancel/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }

            const donationRequest = {
                $set: {
                    status: "cancel"
                }
            }

            const result = await donationRequestCollection.updateOne(query, donationRequest, options)
            res.send(result)
        })

        app.get("/my-donation-request", async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await donationRequestCollection.find(query).toArray()
            res.send(result)
        });
        app.get("/my-latest-donation-request", async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await donationRequestCollection.find(query).sort({ date: -1 }).limit(3).toArray()
            res.send(result)
        });
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", async (req, res) => {
    res.send("blood donation runing");
})



app.listen(port)