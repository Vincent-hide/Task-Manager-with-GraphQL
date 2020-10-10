const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');

require('dotenv').config();

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const { connection } = require('./databse/util');
const { verifyUser } = require('./helper/context');

connection();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    await verifyUser(req);
    return {
      email: req.email
    }
  }
});

apolloServer.applyMiddleware({app, path: '/graphql'});

app.get("/", (req, res) => {
  res.send("GraphQL Task Manager")
})

app.listen(PORT, () => {
  console.log(`Server listening on PORT: localhost:${PORT}`);
  console.log(`Graphql Endpoint: localhost:${PORT}${apolloServer.graphqlPath}`);
});