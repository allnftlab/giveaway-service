FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --production 

RUN npm install -g tsup

RUN ls

COPY . .

RUN ls

RUN npm run build

RUN ls

EXPOSE 3000

CMD ["npm", "start"]