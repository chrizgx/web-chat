# Web Chat web application

## The 'why' behind this project

*This is app is made to serve as a portfolio project, demonstrating a significant portion of the skills I've been learning since last year.*

## Technologies used:

**Frontend**
- HTML
- CSS
- Bootstrap
- Vue.js

**Backend**
- Node.js
- Express.js
- PostgreSQL
- User authentication with through express-session

## How to setup the app.

**Prerequisities**

- Download and install Node.JS (v16+)
- Download and install PostgreSQL, then setup a database (prefer name 'messages')

**Setup Instructions**

1. Navigate to the folder that contains project files and open terminal.
2. Run `npm install` through the terminal to install dependencies
3. Run the `setup.sql` script to create users, chats, and users_chats tables in database.
4. Run the `table.sql` file contained in `./node_module/connect-pg-simple/` folder to setup session table.
5. To start server, you can run `node app.js`, but you have to declare variables related to the database. For example: `USER="postgres" PASSWORD="postgres" HOST="localhost" DB_PORT=5432 DB="messenger" SECRET="whatever" node app.js`. There are specifications about each variable below...

<!-- **Start Server**

> The server was developed to run on Node.js v16.15. In case of any errors, switch to this version and run the app.

1. Install Node.JS
2. Run `npm install` through the terminal to install dependencies
3. You can run `node app.js`, but you have to declare variables related to the database. For example: `USER="postgres" PASSWORD="postgres" HOST="localhost" DB_PORT=5432 DB="messenger" SECRET="whatever" node app.js`. There are specifications about each variable below... -->

**Variables**

- USER: The username that will be used to connect to psql database.
- PASSWORD: The password of the psql database user.
- HOST: The host of the database (could be an address, a URL, or "localhost", depending on the database host).
- DB_PORT: The port of the database. Usually it's "5432"
- DB: The name of the database.
- SECRET: This is the key used to create session tokens (used for authentication). This key should not change through app restarts, because it will cancel all previously created sessions.