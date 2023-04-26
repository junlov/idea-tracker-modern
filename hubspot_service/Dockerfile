FROM node:19-bullseye

WORKDIR /usr/app

COPY ./package.json ./

COPY ./package-lock.json ./

RUN npm install

COPY . .

RUN echo "copied everythign over for server"

EXPOSE 8080

CMD ["npm", "start"]
