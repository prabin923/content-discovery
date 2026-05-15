FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/

RUN npm ci --workspace=backend --workspace=@discovery-hub/shared

COPY shared ./shared
COPY backend/tsconfig.json ./backend/
COPY backend/src ./backend/src

RUN npm run build -w @discovery-hub/shared && npm run build -w backend

WORKDIR /app/backend
EXPOSE 5000
CMD ["node", "dist/server.js"]
