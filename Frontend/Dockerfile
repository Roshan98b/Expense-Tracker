FROM node:lts-alpine as build
WORKDIR /app
COPY . /app/
ENV NODE_OPTIONS --openssl-legacy-provider
RUN npm install && npm run build

FROM nginx:alpine as deploy
COPY --from=build /app/dist/Frontend/ /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
