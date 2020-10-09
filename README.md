# Task Manager using Graphql 

[localhost:3002/graphql](http://localhost:3002/graphql)

## Environmental Variables
create a file called .env and provide a following code
    
    PORT=3002
    MONGO_DB_URL=mongodb://localhost/taskdb

## Task 
    query GetAllTask {
      tasks {
        id
        name
      }
    }
    
    query GetTaskById{
      task(id: "1") {
        id
        name
        completed
      }
    }
    
    mutation CreateTask {
      createTask(input:{
        name: "New Task"
        completed: false
        userId: "1"
      }) {
        id
        name
        completed
      }
    }    
## User
    query getAllUsers {
      users {
        id
        name
        tasks {
          id
          name
          completed
        }
      }
    }
    
    query getUserById {
      user(id: "2") {
        id
        name
        email
        tasks {
          id
          name
          completed
        }
      }
    }
