FROM node:12.22.9

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

CMD [ "node", "motus.js" ]
