# Task_managemant_system

## add the below values of env
JWT_SECRET_KEY=
MONGODB_URL=
MONGO_DB=
EMAIL=
EMAIL_PASSWORD=

## Run the following commands to run the server

1. $ nvm use 20
2. $ npm i
3. $ npm start



### The server will start to run on http://localhost:3001
1.  import the postman collection
2. register a user with admin role using the following endpoint
http://localhost:3001/api/auth/register

3. login the user using the below endpoint to generate the access and refresh token
http://localhost:3001/api/auth/login 

4. pass the access token to the create task using the below -> post request
http://localhost:3001/api/tasks

5. pass the access token to the below endpoint to update the task -> get request
http://localhost:3001/api/tasks

6. pass the access token to the below endpoint to fetch the tasks list
http://localhost:3001/api/tasks?page=1&limit=10
 
- the above endpoint has filter to serach the tasks using the title of task
- the above endpoint has filter to fetch the tasks based on the status of the task which accepts pending, in_progress, completed
7. use the below endpoint to delete a task
    - delete request
    http://localhost:3001/api/tasks/:id

8. the above enpoints also send notification emails for create, update and delete of tasks.