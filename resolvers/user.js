const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { combineResolvers } = require('graphql-resolvers');

const Task = require('../databse/models/task');
const User = require('../databse/models/user');
const { isAuthenticated } = require('./middleware');

module.exports = {
  Mutation: {
    signup: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });

        // check if an account with the provided email exists
        if(user) {
          throw new Error('The given Email is already in use');
        }

        // hash a password
        const hashedPassword = await bcrypt.hash(input.password, 12);

        const newUser = new User({
          ...input,
          password: hashedPassword
        });

        const result = newUser.save();
        // console.log(result._id, typeof result._id); // 'object'
        // console.log(result.id, typeof result.id);   // 'string'

        return result;

      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    login: async (_, args) => {
      try {
        const user = await User.findOne({ email: args.input.email });
        if(!user) {
          throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(args.input.password, user.password);
        if(!isPasswordValid) {
          throw new Error('Incorrect password');
        }

        // JWT
        const secret = process.env.JWT_SECRET_KEY || 'mysecretkey';
        const token = jwt.sign({ email: user.email }, secret, { expiresIn: '1d' });
        return { token: token }

      }catch (err) {
        console.error(err);
        throw err;
      }

    }
  },
  Query: {
    user: combineResolvers(isAuthenticated, async (_, __, { email }) => {
      const user = await User.findOne({ email: email });
      try {
        const user = await User.findOne({ email: email });
        if(!user) {
          throw new Error('User not found!');
        }
        return user;
      } catch (err) {
        console.error(err);
        throw new Error("User not found");
      }
    }),
  },
  User: {
    tasks: async ({id}) => {
      try {
        const tasks = await Task.find({ user: id });
        return tasks;
      } catch (err){
        console.log(err);
        throw err;
      }
    }
  }
};