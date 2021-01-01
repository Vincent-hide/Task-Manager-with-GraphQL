const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    user: User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
    createdAt: Date!
    updatedAt: Date!
  }

  input signupInput {
    name: String!
    email: String!
    password: String!
  }

  extend type Mutation {
    signup(input: signupInput): User
    login(input: loginInput): Token
  }

  input loginInput {
    email: String
    password: String!
  }

  type Token {
    token: String!
  }

  extend type Subscription {
    userCreated: User
  }
`;
