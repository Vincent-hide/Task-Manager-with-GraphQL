const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const cors = require('cors');
require('dotenv').config();

const {tasks, users} = require('./constants');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const typeDefs = gql`
    type Query {
        greetings: [String!]
        tasks: [Task!]
        task(id: ID!) : Task
        users: [User!]
        user(id: ID!): User
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

    input createTaskInput {
        name: String!
        completed: Boolean!
        userId: ID!
    }

    type Mutation {
        createTask(input: createTaskInput): Task
    }
`

const resolvers = {
  Query: {
    greetings: () => null,
    tasks: () => {
      console.log(tasks);
      return tasks;
    },
    task: (parent, args) => {
      console.log("Parent:", parent);
      return tasks.find(task => task.id === args.id);
    },
    users: () => users,
    user: (_, {id}) => users.find(user => user.id === id),
  },
  Mutation: {
    createTask: (_, { input }) => {
      const task = { ...input, id:uuid.v4() };
      tasks.push(task);
      return task;
    }
  },
  Task: {
    user: (parent) => users.find(user => user.id === parent.userId)
    // or user: ({ userId }) => users.find(user => user.id === userId)
  },
  User: {
    tasks: ({id}) => tasks.filter(task => task.userId === id)
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