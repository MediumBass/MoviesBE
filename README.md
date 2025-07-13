## 🎬 About Project

 Express+SQLite+Sequelize backend API for managing movies

## 🚀 How to Run the Docker App

1) Download image from DockerHub:
    https://hub.docker.com/r/mediumbass/moviesbe

### docker pull mediumbass/moviesbe

2) Run container with 

   ### docker run --name movies -p 8000:8050 -e APP_PORT=8050 mediumbass/moviesbe

  or if you want to overwrite security params:

  ### docker run --name movies -p 8000:8050 -e APP_PORT=8050 -e SALT_ROUNDS=9 -e ACCESS_SECRET="secret" -e REFRESH_SECRET="refresh" mediumbass/moviesbe

3) Go to:

   http://localhost:8000

   Register, load .txt and viev list. Notice than web interface support only /users /movies/import and /movies/list endpoints

4)  To fully test API go to:

   https://documenter.getpostman.com/view/356840/TzkyLeVK#11fde7a2-c427-49d8-865b-444cb8e01c89

  1) Press Run in Postman
  2) Set enviroment to movie
  3) Run Users/create
  4) Run Sessions/create
  5) Make sure that {{token}} is set to last response
  6) Run other endpoints


## 📁 Project Structure

MoviesBE/

│

├── controllers/         # Route handler logic (e.g., movies, users)

├── database/            # Database configuration and models

├── middlewares/         # Custom Express middlewares (e.g., auth, error handling)

├── public/              # Static HTML files served by Express 

├── routers/             # Express route definitions and validation

├── uploads/             #### Dir for temp files uploading
