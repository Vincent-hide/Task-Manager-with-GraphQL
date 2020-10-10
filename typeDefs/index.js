const {gql} = require('apollo-server-express');

const userTypeDefs = require('./user');
const taskTypeDefs = require('./task');

const typeDefs = gql`
    scalar Date
    
    type Query {
        _: String # placeholder 
    }

    type Mutation {
        _: String # placeholder
    }
`

module.exports = [
    typeDefs,
    userTypeDefs,
    taskTypeDefs
]