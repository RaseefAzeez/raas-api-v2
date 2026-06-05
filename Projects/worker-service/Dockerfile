FROM node:18-alpine

WORKDIR /app

COPY worker-service/package*.json ./

RUN npm install --production

COPY worker-service ./worker-service
COPY shared ./shared

WORKDIR /app/worker-service

CMD ["node", "src/workers/operationWorker.js"]