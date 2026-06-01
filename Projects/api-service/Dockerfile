FROM node:18-alpine

WORKDIR /app

COPY api-service/package*.json ./

RUN npm install --production

COPY api-service ./api-service
COPY shared ./shared

WORKDIR /app/api-service

CMD ["node", "src/server.js"]