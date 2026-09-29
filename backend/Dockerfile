FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && mkdir logs && chown node:node logs
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 5000
CMD ["node", "dist/main.js"]
