
FROM node:19-bullseye

WORKDIR /usr/app

COPY package.json ./

COPY ./package-lock.json ./

RUN npm i

COPY . .

RUN echo "copied everything over for client"

EXPOSE 5173

CMD ["npm", "run", "dev"]