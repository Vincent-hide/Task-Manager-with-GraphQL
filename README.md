# Task Manager using Graphql without Database

[localhost:3002/graphql](http://localhost:3002/graphql)

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
