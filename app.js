const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// INITIATE AUTHENTICATION
const pgSession = require('connect-pg-simple')(session);
const pool = require("./config/db");

app.use(
    session({
        store: new pgSession({
            pool: pool
        }),
        secret: process.env.SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            secure: false,
            httpOnly: false,
            sameSite: false,
            maxAge: 1000 * 60 * 60 * 1.5
        },
    })
);

// Serve public files from 'assets' folder
app.use('/assets', express.static('./assets'));

// Handle all requests related to user authentication.
const sessionRouter = require('./routers/session');
app.use('/', sessionRouter);



app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${process.env.PORT || 3000}`);
});