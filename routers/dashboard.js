const express = require('express');
const router = express.Router();

const contacts = require('../database/contacts');

router.get('/contacts', async (req, res, next) => {
    try {
        const results = await contacts.getUserContacts(req.session.user.id);
        res.json({results});
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.post('/contacts/new', async (req, res, next) => {
    const myId = req.session.user.id;
    let {otherUsername} = req.body;
    otherUsername = otherUsername.toLowerCase();
    if (otherUsername === null) {
        return res.sendStatus(404);
    }

    
    const otherId = await contacts.getUserId(otherUsername);
    console.log(otherId, otherUsername);
    if (otherId) {
        if (await contacts.checkContactExists(myId, otherId)) {
            return res.sendStatus(406);
        }
        const chatId = await contacts.createChat();
        await contacts.createContact(myId, otherId, chatId);
        await contacts.createContact(otherId, myId, chatId);
        return res.sendStatus(200);
    }

    return res.sendStatus(403);

})

module.exports = router;