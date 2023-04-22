const express = require('express');
const router = express.Router();

const chats = require('../database/chats');

router.get('/chat/userinfo/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        const data = await chats.getUser(userId);
        console.log(data);
        return res.json({data: data});
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.get('/chat/:id', async (req, res, next) => {
    try {
        const chatId = req.params.id;
        
        // Checks will be added later to prevent
        // access to unauthorized users

        const chat = await chats.getChat(chatId);

        return res.json({ messages: chat.data.messages });

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
        return res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
})

module.exports = router;