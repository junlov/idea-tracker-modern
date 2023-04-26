FROM node:19-bullseye

WORKDIR /usr/app

COPY ./package.json ./

COPY ./package-lock.json ./

#https://github.com/kelektiv/node.bcrypt.js/wiki/Installation-Instructions#docker
# RUN apk --no-cache add --virtual builds-deps build-base python

RUN npm install

# RUN npm rebuild bcrypt --build-from-source

COPY . .

RUN echo "copied everything over for server"

EXPOSE 8080

CMD ["npm", "start"]
