FROM node:21-bullseye-slim

WORKDIR /app
COPY . /app

RUN npm ci

EXPOSE 30000

CMD ["npm", "run", "dev"]
