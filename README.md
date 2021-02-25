# shopping-cart

A full stack implementaion of shopping cart functionality with React, Node.js, MongoDB, Express and Redis. Whole project is being developed using TypeScript.

Still in development.

## Installation

In order to run this project locally, you need to have docker and docker-composed installed.

- Clone this git repository
- At the root folder of the project run `docker-compose build` command
- After build completed, run `docker-compose up` command
- You can access the app at `http://localhost:5000` address.

## Project Overview

Frontend part of the project is built using react, redux-toolkit, TypeScript, socket.io, bulma and configured with webpack.

Backend is using Node.js, Express, Redis, socket.io and MongoDB.

- Users can update stock quantity of any item with or without logging in to the system.
- Users can add producst to their cart with out withou logging in to the system.
- If they add items to their cart first and login later on, their cart keeps the items and update their cart info at the database.
- If they sign in without any items added to their cart, the app checks the database if the user has any items in his/her cart from previous sessions.
- Authentication is done with session based authentication. Redis is used as session store.
- If a logged in user opens the app in two different tabs, the updates made in one tab is reflected immediately with a notification modal in the other tab.
