FROM node:12.22.9 as score

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 4100

CMD [ "node", "score.js" ]
