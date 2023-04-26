

# Setup and build the client

FROM node:19-bullseye as client

WORKDIR /usr/app/client/
COPY client/package.json ./
COPY client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build
RUN echo "just ran build"


# Setup the server

FROM node:19-bullseye

WORKDIR /usr/app/
COPY --from=client /usr/app/client/build/ ./client/build/

WORKDIR /usr/app/server/
COPY web_service/package.json ./
COPY web_service/package-lock.json ./
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install
COPY web_service/ ./

EXPOSE 8080
