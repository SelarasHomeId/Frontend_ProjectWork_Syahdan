# Base
FROM node:22-alpine3.22 as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Development
FROM base as development
ENV NODE_ENV=development
EXPOSE 8000
CMD ["npm", "start", "--", "--host", "0.0.0.0"]

# Production
FROM base as production
ENV NODE_ENV=production
COPY web-production.env .env
RUN npm run build
RUN npm install -g serve
EXPOSE 8000
CMD ["serve", "-s", "build", "-l", "8000"]
