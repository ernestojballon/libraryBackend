import 'dotenv/config'
import express from "express";
import {graphqlHTTP} from "express-graphql"
import schema from "./schema/index.js";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const username = encodeURIComponent(process.env.MONGO_USERNAME);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.awchh.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => console.log('Connected!'))
  .catch((error)=>{
    console.log(error)
    console.log("Couldn't connect to MongoDB");
  })
  
const app = express();

app.use(bodyParser.json()); 
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;






