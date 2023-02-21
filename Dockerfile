# Stage 1: Build
FROM node:14.17.3-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

ENV DORY_API_REST=
ENV FIREBASE_API_KEY=
ENV FIREBASE_APP_ID=
ENV FIREBASE_AUTH_DOMAIN=
ENV FIREBASE_LOCATION_ID=
ENV FIREBASE_MESSAGING_SENDER_ID=
ENV FIREBASE_PROJECT_ID=
ENV FIREBASE_STORAGE_BUCKET=
ENV MAPS_API_KEY=
ENV OAUTH_CLIENT_ID=
ENV DORY_SERVER_URL=
ENV THIS_WEB_URL =
ENV GINELECT_URL=
ENV  LIMIT_PHOTOS_FORUM=
ENV LIMIT_PHOTOS_USER_SERVICE=

RUN npm run build

# Stage 2
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/web-app-dory /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
