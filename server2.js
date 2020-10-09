const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
require('dotenv').config();

const { tasks } = require('./constants');

const app = express();

app.use(cors());
app.use(express.json);

const PORT = process.env.PORT || 3000;

const typeDefs = gql`
	type Query {
		greetings: [String!]
#	  task: [Task!]
	}
	
#	type User {
#		id: ID!
#		name: String!
#		email: String!
#		tasks: [Task!]
#	}
#	
#	type Task {
#		id: ID!
#		name: String!
#		completed: Boolean!
#		user: User!
#	}
`

const resolvers = {
	Query: {
		greetings: () => null,
		// tasks: () => tasks
	}
};

// const apolloServer = new ApolloServer({
// 	typeDefs,
// 	resolvers
// });

app.get('/test', (req, res) => {
	res.send('TEST');
})

// apolloServer.applyMiddleware({ app, path: '/graphql'});

app.listen(PORT, () => {
	console.log(`Server listening on PORT: ${PORT}`);
	// console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});