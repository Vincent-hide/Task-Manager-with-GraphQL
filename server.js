const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
require('dotenv').config();

const {tasks, users} = require('./constants');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const typeDefs = gql`
    type Query {
        greetings: [String!]
        tasks: [Task!]
    }

    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!]
    }

    type Task {
        id: ID!
        name: String!
        completed: Boolean!
        user: User!
    }
`

const resolvers = {
  Query: {
    greetings: () => null,
    tasks: () => {
      console.log(tasks);
      return tasks;
    }
  },
  Task: {
    user: (parent) => users.find(user => user.id === parent.userId)
  }
};

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