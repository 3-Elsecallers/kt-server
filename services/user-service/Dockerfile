FROM node:25-alpine3.21 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:25-alpine3.21
WORKDIR /app
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/generated/ ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY .env ./
COPY package*.json ./
RUN npm install --production
EXPOSE 8081
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]