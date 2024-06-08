FROM node:20-alpine
ENV NODE_ENV development
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate

# Starting our application
CMD [ "node", "app.js" ]

# Exposing server port
EXPOSE 5000
