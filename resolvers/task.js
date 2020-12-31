const { tasks, users } = require("../constants");
const { combineResolvers } = require("graphql-resolvers");

const Task = require("../database/models/task");
const User = require("../database/models/user");
const { isAuthenticated, isTaskOwner } = require("./middleware");
const { translateAliases } = require("../database/models/task");

module.exports = {
  Query: {
    tasks: combineResolvers(isAuthenticated, async (_, __, { userId }) => {
      try {
        const tasks = await Task.find({ user: userId });
        return tasks;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }),
    task: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (parent, { id }) => {
        // console.log("Parent:", parent);

        try {
          const task = await Task.findById(id);
          return task;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
    ),
  },
  Mutation: {
    createTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { email }) => {
        try {
          const user = await User.findOne({ email });
          const task = new Task({ ...input, user: user.id });
          const result = await task.save();
          user.tasks.push(result.id);
          // console.log('User', user);
          await user.save();
          return task;
        } catch (e) {
          console.log(e);
          throw e;
        }
      }
    ),
    updateTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_, { id, input }) => {
        try {
          const task = await Task.findByIdAndUpdate(
            id,
            { ...input },
            { new: true }
          );
          return task;
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
    ),
  },
  Task: {
    user: async (parent) => {
      try {
        // console.log("parent", parent)
        const user = await User.findById(parent.user);
        return user;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
