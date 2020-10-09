const {tasks, users} = require('../constants');

module.exports = {
  Query: {
    users: () => users,
    user: (_, {id}) => users.find(user => user.id === id),
  },
  User: {
    tasks: ({id}) => tasks.filter(task => task.userId === id)
  }
};