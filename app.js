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

// Validate Cookie to prevent unauthorized users
// from accessing the paths specified below
app.use(sessionRouter.validateCookie);


// Routes for supporting all dashboard backend operations
const contactsRouter = require('./routers/dashboard');
app.use('/api', contactsRouter);

app.get('/dashboard', async (req, res, next) => {
    try {
        res.sendFile('/assets/dashboard/index.html', {root: './'});
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

app.get('/chat', async (req, res, next) => {
    try {
        res.sendFile('/assets/chat/index.html', { root: './' });
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
})

app.get('/:notfound', (req, res, next) => {
    try {
        res.redirect('/login');
    } catch(e) {
        res.sendStatus(500);
    }
})


app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${process.env.PORT || 3000}`);
});