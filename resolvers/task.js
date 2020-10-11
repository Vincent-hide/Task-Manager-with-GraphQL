const {tasks, users} = require('../constants');
const uuid = require('uuid');

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
    createTask: (_, { input }) => {
      const task = { ...input, id:uuid.v4() };
      tasks.push(task);
      return task;
    }
  },
  Task: {
    user: (parent) => {
      console.log("TEST")
      return users.find(user => user.id === parent.userId)
    }
    // or user: ({ userId }) => users.find(user => user.id === userId)
  },
};
