const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");

require("dotenv").config();

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");

const { connection } = require("./database/util");
const { verifyUser } = require("./helper/context");

const loaders = require("./loaders");
const DataLoader = require("dataloader");

// for db
connection();

const app = express();
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    const contextObj = {};
    if(req) {
      await verifyUser(req);
      contextObj.email = req.email;
      contextObj.userId = req.userid;
    }
    contextObj.loaders = {
      user: new DataLoader(keys => loaders.user.batchUsers(keys))
    }
    return contextObj;
  },
  formatError: err => {
    console.log(err);
    return {
      message: `hey man, you got an error due to the following reason: "${err.message}"`,
    };
  }
});

apolloServer.applyMiddleware({ app, path: "/graphql" });

app.get("/", (req, res) => {
  res.send("GraphQL Task Manager");
});

const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on PORT: localhost:${PORT}`);
  console.log(
    `🚀 Graphql Endpoint: localhost:${PORT}${apolloServer.graphqlPath}`
  );
});

apolloServer.installSubscriptionHandlers(httpServer);