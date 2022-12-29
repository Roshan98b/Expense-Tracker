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
MONGO_URL=172.28.194.146
MONGO_PORT=27017
MONGO_DATABASE=project
SESSION_SECRET=secret
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_EMAIL=admin_email
NODEMAILER_PASSWORD=admin_password
FF_NODEMAILER=false
```

Install dependencies
```
npm install
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

## Angular frontend

Install Angluar CLI
```
sudo npm install -g @angular/cli
```

Install dependencies
```
npm install
```

Environment variables used in `.env` file
```
ENV_API_BACKEND_PROTOCOL=http
ENV_API_BACKEND_URL=172.28.194.146
ENV_API_BACKEND_PORT=80
ENV_API_BACKEND_PATH=users
```

After exporting above variables below command replaces the variables in `env.js`
```
envsubst < ./src/assets/env.template.js > ./src/assets/env.js
```

Run app locally
```
export NODE_OPTIONS=--openssl-legacy-provider #optional, if app fails to start
npm run build
npm start
```

Build docker image from `Dockerfile`
```
docker build -t ext-frontend:1.0.0 -t ext-frontend:latest .
```

If build fails, optional environment variables to be added
```
export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0
```

Run app on a docker container
```
docker run -d --rm --name ext-frontend -p 8080:80 --env-file ./.env ext-frontend:latest
```

## Kubernetes configurations

Create the Nginx Ingress Controller using Helm in a new namespace.
```
kubectl create namespace ingress-nginx

helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

helm install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --set controller.replicaCount=2
```

Deploy the mongo DB service
```
cd ./Backend
kubectl apply -f ./manifests/Exp-Backend.yaml -n ext
```

After build, Tag and push the application docker images to ACR
```
# Backend build and push image
docker build -t ext-backend:1.0.0 -t ext-backend:latest .
docker tag ext-backend:latest robadrinacr1.azurecr.io/ext-backend:latest
docker push robadrinacr1.azurecr.io/ext-backend:latest

# Frontend build and push image
docker build -t ext-frontend:1.0.0 -t ext-frontend:latest .
docker tag ext-frontend:latest robadrinacr1.azurecr.io/ext-frontend:latest
docker push robadrinacr1.azurecr.io/ext-frontend:latest
```

Deploy the backend configuration, ingress and then the application which creates a config map, deployment and a service. Uses a new namespace `ext` for the deployment.
```
cd ./Backend
kubectl apply -f ./manifests/Exp-Backend.config.yaml -n ext
kubectl apply -f ./manifests/Exp-Backend.ingress.yaml -n ext
kubectl apply -f ./manifests/Exp-Backend.yaml -n ext
```

Deploy the frontend configuration, ingress and then the application which creates a config map, deployment and a service. Uses a new namespace `ext` for the deployment.
```
cd ./Frontend
kubectl apply -f ./manifests/Exp-Frontend.config.yaml -n ext
kubectl apply -f ./manifests/Exp-Frontend.ingress.yaml -n ext
kubectl apply -f ./manifests/Exp-Frontend.yaml -n ext
```

Other troubleshooting commands
```
# Map running pod shell to terminal
kubectl get pods -n ext
kubectl exec -i -t -n ext ext-frontend-podname -- /bin/sh

# Get logs of a pod
kubectl get pods -n ext
kubectl logs  -n ext ext-frontend-podname

# Restart or redeploy a deployment
kubectl rollout restart deployment ext-frontend -n ext 
```
