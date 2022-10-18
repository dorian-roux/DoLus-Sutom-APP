FROM node:12.22.9 as sutom

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 4000

CMD [ "node", "index.js" ]
