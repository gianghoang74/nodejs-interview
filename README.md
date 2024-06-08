# nodejs-interview

## Setup

- Install docker and docker compose
- Create .env file follow by .env.template, and change the value of secret if needed
- Run `docker compose up` to start the service
- Run `npm run migrate` to create local database
- Server should be running in `localhost:5000`

## Seeding initial data

- Run `npm i`
- Run `npx prisma db seed`
- This will create a default test user and game associated with default user

## Available endpoints

- Available endpoints are listed in `localhost:5000/api-docs`
