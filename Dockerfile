FROM node:alpine AS build
WORKDIR /usr/src/app
COPY ./germany-weather/package.json ./germany-weather/package-lock.json ./
RUN npm install
COPY ./germany-weather .
RUN npm run build

FROM nginx:1.23.0-alpine
COPY --from=build /usr/src/app/dist/germany-weather /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf