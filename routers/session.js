const express = require('express');
const router = express.Router();
//json({ user: req.session.user })
// Handle login and logout
const userManagement = require("../database/userManagement");

router.validateCookie = async (req, res, next) => {
    try {
        if (req.sessionID && req.session.user && await userManagement.validateActiveUser(req.session.user) == 1) return next();
        return res.redirect('/logout');
    } catch (e) {
        console.error(e);
        res.redirect('/');
    }
}

router.get('/', async (req, res) => {
    try {
        res.redirect('/login');
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.get('/login', async (req, res) => {
    try {
        // Check whether user is already logged in.
        // If yes, redirect them to dashboard page.
        if (req.sessionID && req.session.user) {
            return res.redirect('/dashboard');
        }
        // Otherwise, serve the login page.
        res.sendFile('/assets/login/index.html', {root: './'});
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`New login attempt: ${username}`);

    if (username == null || password == null) {
        return res.sendStatus(403)
    }

    try {
        // Validate credentials through database
        const user = await userManagement.getUserByUsernameAndPassword(username, password);
        console.log(user);
        if (!user) return res.redirect('/login');

        // create new session
        req.session.user = {
            id: user.id,
            username: user.username
        };

        res.status(200);
        return res.redirect('/dashboard');

    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
});

router.get('/signup', async (req, res) => {
    try {
        // Redirect to dashboard if already logged in.
        if (req.sessionID && req.session.user) {
            return res.redirect('/dashboard');
        }
        // ...
        res.sendFile('/assets/signup/index.html', {root: './'});
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`New User registering with username ${username} and password: ${password}`);

        if (username == null || password == null || await userManagement.usernameAlreadyExists(username)) {
            console.log('DENIED')
            return res.status(403).redirect('/signup');
        }
        
        // Create user, then fetch credentials to simulate a login.
        const user = await userManagement.createUser(username, password);
        console.log(user);
        if (!user) return res.redirect('/signup');

        req.session.user = {
            id: user.id,
            username: user.username
        }

        res.status(200);
        return res.redirect('/dashboard');
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
})

router.get('/logout', async (req, res) => {
    try {
        // Delete session token from database.
        await req.session.destroy();
        return res.redirect('/login');
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
})

module.exports = router;