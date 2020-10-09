const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
require('dotenv').config();

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());



const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
});

apolloServer.applyMiddleware({app, path: '/graphql'});

app.get("/", (req, res) => {
  res.send("GraphQL Task Manager")
})

app.listen(PORT, () => {
  console.log(`Server listening on PORT: localhost:${PORT}`);
  console.log(`Graphql Endpoint: localhost:${PORT}${apolloServer.graphqlPath}`);
});