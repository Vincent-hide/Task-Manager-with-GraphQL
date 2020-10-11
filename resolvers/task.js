const { tasks, users } = require('../constants');
const { combineResolvers } = require('graphql-resolvers');

const Task = require('../databse/models/task');
const User = require('../databse/models/user');
const { isAuthenticated } = require('./middleware');

module.exports = {
  Query: {
    tasks: () => {
      console.log(tasks);
      return tasks;
    },
    task: (parent, args) => {
      console.log("Parent:", parent);
      return tasks.find(task => task.id === args.id);
    },
  },
  Mutation: {
    createTask: combineResolvers(isAuthenticated, async (_, { input }, { email }) => {
      try{
        const user = await User.findOne({ email });
        const task = new Task({ ...input, user: user.id })
        const result = await task.save();
        user.tasks.push(result.id);
        await user.save();
        return task;
      }catch (e) {
        console.log(e);
        throw e;
      }
    })
  },
  Task: {
    user: (parent) => {
      return users.find(user => user.id === parent.userId)
    }
    // or user: ({ userId }) => users.find(user => user.id === userId)
  },
};
