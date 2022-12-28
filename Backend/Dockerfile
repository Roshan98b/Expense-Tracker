# Base
FROM node:lts-alpine
WORKDIR /usr/src/app

# Application files
COPY . .
RUN npm install

# Run
EXPOSE 3000
CMD [ "node", "app.js" ]