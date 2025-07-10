# 🎬 MoviesBE – Dockerized Backend API

This is a simple Node.js Express backend for managing movies, packaged as a Docker image.

## 🚀📦 How to Start

1)Download the image directly from Docker Hub:
https://hub.docker.com/r/mediumbass/moviesbe

  docker pull mediumbass/moviesbe

2)Than run it with:

  docker run --name movies -p 8000:8050 -e APP_PORT=8050 mediumbass/moviesbe
  
OR to overwrite .env params

  docker run --name movies -p 8000:8050 -e APP_PORT=8050 -e SALT_ROUNDS=9 -e ACCESS_SECRET="secret" -e REFRESH_SECRET="refresh" mediumbass/moviesbe
  
3)Go to:
http://localhost:8000/

Register, then drop txt file from here:
https://gist.github.com/k0stik/3028d42973544dd61c3b4ad863378cad

4)Web interface support only /users /movies/import and /movies endpoints
To check full API go to:
https://documenter.getpostman.com/view/356840/TzkyLeVK#11fde7a2-c427-49d8-865b-444cb8e01c89

  1. Press RUN IN POSTMAN
  2. Change Enviroment to movie
  3. Run Users/Create
  4. Run Sessions/Create, make sure that {{token}} === response.token
  5. Run all endpoints from Movies
     
## 🏗️ Project Architecture

MoviesBE/

├── controllers/     # Logic for handling requests and responses 

├── database/        # Database configuration and models 

├── middlewares/     # Custom Express middlewares (e.g. authentication, responseWrapper)

├── public/          # Static HTML for web interface

├── routers/         # Route definitions that map URLs to controllers

├── uploads          # Temp dir for reading txt
