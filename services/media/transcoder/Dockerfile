FROM node:20.11.1-bullseye-slim as base
WORKDIR /app

FROM base as builder
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM base as prod
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm install --omit=dev
EXPOSE 4000 
CMD ["npm", "run", "start:prod"]