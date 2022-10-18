FROM node:12.22.9 as authenticate

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 4200

CMD [ "node", "authentication.js" ]
