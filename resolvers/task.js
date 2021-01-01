const { combineResolvers } = require("graphql-resolvers");

const Task = require("../database/models/task");
const User = require("../database/models/user");
const { isAuthenticated, isTaskOwner } = require("./middleware");

module.exports = {
  Query: {
    tasks: combineResolvers(
      isAuthenticated,
      async (_, { cursor, limit = 10 }, { userId }) => {
        try {
          const query = { user: userId };
          if (cursor) {
            query["_id"] = {
              $lt: cursor,
            };
          }
          let tasks = await Task.find(query)
            .sort({ _id: -1 })
            .limit(limit + 1);

          // as tasks trys fetch one more document than limit passed, if tasks is bigger than limit, there is still a documents after fetch as same number of documents as limit
          const hasNextPage = tasks.length > limit;
          
          tasks = hasNextPage ? tasks.slice(0, -1) : tasks;

          return {
            taskFeed: tasks,
            pageInfo: {
              nextPageCursor: hasNextPage ? tasks[tasks.length-1].id : null,
              hasNextPage: hasNextPage
            },
          };
        } catch (err) {
          console.log(err);
          throw err;
        }
      }
    ),
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
    deleteTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_, { id }, { userId }) => {
        try {
          const task = await Task.findByIdAndDelete(id);
          await User.updateOne({ _id: userId }, { $pull: { tasks: task.id } });
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
