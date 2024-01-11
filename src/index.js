import 'dotenv/config'
import express from "express";
import {graphqlHTTP} from "express-graphql"
import schema from "./schema/index.js";
import mongoose from 'mongoose';

mongoose.connect(process.env.mongo_server+process.env.database_name)
  .then(() => console.log('Connected!'));

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});




