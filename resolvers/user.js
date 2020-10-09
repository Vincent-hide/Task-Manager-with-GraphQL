const bcrypt = require('bcryptjs');

const {tasks, users} = require('../constants');
const User = require('../databse/models/user')

module.exports = {
  Query: {
    users: () => users,
    user: (_, {id}) => users.find(user => user.id === id),
  },
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
    }
  },
  User: {
    tasks: ({id}) => tasks.filter(task => task.userId === id)
  }
};