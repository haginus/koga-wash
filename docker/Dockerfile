FROM node:16

RUN apt-get update && apt-get install -y netcat nano

WORKDIR /usr/src/koga-wash

COPY package*.json ./

RUN npm install 

COPY . .

ENV NODE_ENV=production
RUN npm run build

ENTRYPOINT [ "/usr/src/koga-wash/docker/entrypoint.sh" ]
CMD [ "npm", "run", "start" ]


