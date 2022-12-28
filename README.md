# Expense-Tracker
A web application for managing monthly/yearly expenses with JavaScript and MongoDB using Angular and Express framework.

## Mongo DB

Pull the mongo db image
```
docker pull mongo:latest
```

Run the mongo docker container
```
docker run -d --rm --name mongo -v ~/workspace/Expense-Tracker/Backend/datadir:/data/db -p 27017:27017 mongo
```

Install shell Mongo Client
```
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
sudo apt update
sudo apt install -y mongodb-mongosh
```

Connect to Mongo DB
```
mongosh "mongodb://host:27017"
```

## Express Backend

Environment variables used in `.env` file
```
MONGO_URL=mongodb://host:27017/project  
SESSION_SECRET=any_password  
NODEMAILER_HOST=smpt_host  
NODEMAILER_EMAIL=nodemailer_emailid  
NODEMAILER_PASSWORD=nodemailer_password
```

Run app locally
```
node app
```

Build docker image from `Dockerfile`
```
docker build -t ext-backend:1.0.0 -t ext-backend:latest .
```

If build fails, optional environment variables to be added
```
export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0
```

Run app on a docker container
```
docker run -d --rm --name ext-backend -p 3000:3000 --env-file ./.env ext-backend:latest
```

