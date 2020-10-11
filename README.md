# Task Manager using Graphql with Database / without update, delete methods

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
      user {
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
    {
      "Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdyZWdAZ21haWwuY29tIiwiaWF0IjoxNjAyMzkwNjk1LCJleHAiOjE2MDI0NzcwOTV9.GmCVoWPtc21xyRB5n80h0YGISzuc6iXs9Q9topv6YLg"
    }
    
    mutation loginUser {
      login(input: { email: "greg@gmail.com", password: "123456" }) {
        token
      }
    }
