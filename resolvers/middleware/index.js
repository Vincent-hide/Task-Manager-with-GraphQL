const { skip } = require("graphql-resolvers");
const Task = require("../../database/models/task");
const { isValidObjectId } = require("../../database/util");


module.exports.isAuthenticated = (parent, args, { email }) => {
  if (!email) {
    throw new Error("Access Denied! Please login to continue");
  }
  return skip;
};

module.exports.isTaskOwner = async (_, { id }, { userId }) => {
  try {
    if(!isValidObjectId(id)) {
      throw new Error('Invalid Task ID, check your task ID again');
    }
    const task = await Task.findById(id);

    if (!task) {
      throw new Error("Task not found");
    } else if (task.user.toString() !== userId) {
      throw new Error("Not authorized as a task owner");
    }
    return skip;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
