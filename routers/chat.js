const express = require('express');
const router = express.Router();

const chats = require('../database/chats');
const userManagement = require('../database/userManagement');

router.cache = {};

router.get('/chat/userinfo/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        const data = await chats.getUser(userId);
        // console.log(data);
        return res.json({data: data});
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.post('/chat/:id', async (req, res, next) => {
    try {
        const chatId = req.params.id;
        const { lastMessage } = req.body;
        // Checks will be added later to prevent
        // access to unauthorized users

        // Refer to cache to trace differences. If cached
        // last message is the same as client's last message,
        // prevent database from reloading the same resources.
        if (lastMessage !== undefined && router.cache[chatId] !== undefined && router.cache[chatId] === lastMessage) {
            return res.sendStatus(304);
        }

        const chat = await chats.getChat(chatId);

        if (!router.cache[chatId]) {
            console.log("creating cache record");
            router.cache[chatId] = chat.data.messages[0].message;
        }

        return res.status(200).json({ messages: chat.data.messages });

    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.post('/chat/:id/new', async (req, res, next) => {
    try {
        const chatId = req.params.id;
        const {message} = req.body;
        console.log(message);

        const chat = await chats.getChat(chatId);
        chat.data.messages.unshift({message: message, id: req.session.user.id});
        if (chat.data.messages.length > 20) {
            chat.data.messages = chat.data.messages.slice(0, 20);
        }
        await chats.updateChat(chat.data, chatId);

        // Cache last message
        router.cache[chatId] = message;

        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.get('/chat/last-active/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        const data = await userManagement.getUserStatus(userId);

        if (!data) {
            return res.sendStatus(404);
        }

        const currentDate = Date.now();
        const lastRequest = data.last_request;
        
        let timeElapsed = currentDate - lastRequest;
        timeElapsed = Math.floor(timeElapsed / 1000);

        let message = '';
        let active = false;

        if (timeElapsed < 60) {
            // message = `${timeElapsed} seconds ago`;
            message = 'Active now';
            active = true;
        } else if (timeElapsed < 3600){
            message = `${Math.floor(timeElapsed / 60)} ${Math.floor(timeElapsed / 60) == 1 ? 'minute' : 'minutes'} ago`;
        } else if (timeElapsed < 86400) {
            message = `${Math.floor(timeElapsed / 3600)} ${timeElapsed >= 3600*2 ? 'hours' : 'hour'} ago`;
        } else {
            message = null;
        }

        return res.json({lastActive: message, active: active});
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
})

module.exports = router;