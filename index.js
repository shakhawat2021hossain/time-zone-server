const express = require("express");
const cors = require("cors");
const { MongoClient, Admin } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//middleware
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//db

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xxplp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const productsCollection = client.db("timeZone").collection("products");
  const reviewsCollection = client.db("timeZone").collection("reviews");
  const ordersCollection = client.db("timeZone").collection("orders");
  const usersCollection = client.db("timeZone").collection("users");

  //add product
  app.post("/addProduct", async (req, res) => {
    const order = req.body;
    const result = await productsCollection.insertOne(order);
    // console.log(result);
    res.json(result);
  });

  //add review
  app.post("/addReview", async (req, res) => {
    const review = req.body;
    const result = await reviewsCollection.insertOne(review);
    console.log(result);
    res.json(result);
  });

  //get all products
  app.get("/products", async (req, res) => {
    const cursor = productsCollection.find({});
    const products = await cursor.toArray();
    res.send(products);
  });
  //get all orders
  app.get("/orders", async (req, res) => {
    const cursor = ordersCollection.find({});
    const orders = await cursor.toArray();
    res.send(orders);
  });

  //get all reviews
  app.get("/reviews", async (req, res) => {
    const cursor = reviewsCollection.find({});
    const reviews = await cursor.toArray();
    res.send(reviews);
  });

  //booking or order a single product
  app.get("/products/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const product = await productsCollection.findOne(query);
    res.json(product);
    console.log(id);
  });

  //add order post
  app.post("/addOrder", async (req, res) => {
    const order = req.body;
    const result = await ordersCollection.insertOne(order);
    // console.log(result);
    res.json(result);
  });

  //find order using gmail query
  app.get("/orders", async (req, res) => {
    const email = req.query.email;
    const query = { email: email };
    const cursor = ordersCollection.find(query);
    const orders = await cursor.toArray();
    res.json(orders);
  });

  //post user
  app.post("/users", async (req, res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    console.log(result);
    res.json(result);
  });

  //make admin
  app.put("/users/admin", async (req, res) => {
    const user = req.body;
    console.log(user);
    const filter = { email: user.email };
    const updateDoc = { $set: { role: "admin" } };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.json(result);
  });

  //check isAdmin
  app.get("/users/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    let isAdmin = false;
    if (user?.role === "admin") {
      isAdmin = true;
    }
    res.json({ admin: isAdmin });
  });

  //delete order
  app.delete("/orders/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await ordersCollection.deleteOne(query);
    res.json(result);
  });
});
