const pool = require('../config/db');

// get all user contacts by user_id
const getUserContacts = async (id) => {
    try {
        const results = await pool.query(
            `SELECT users.id as "id",
            users.username as "username",
            users.last_request as "last_request",
            users_chats.chat_id as "chat_id",
            chats.last_message as "last_message",
            chats.last_message_date as "last_message_date"
            FROM users_chats
            JOIN users
                ON users.id = users_chats.other_user_id
            JOIN chats
                ON chats.id = users_chats.chat_id
            WHERE users_chats.user_id = $1;`,
            [id]
        );
        return results.rows;
    } catch (e) {
        console.error(e);
        return [];
    }
}

const getUserId = async (id) => {
    try {
        const results = await pool.query(
            'SELECT * FROM users WHERE username = $1;',
            [id]
        );
        return results.rowCount !== 0 ? results.rows[0].id : null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

const createChat = async () => {
    try {
        const results = await pool.query(
            'INSERT INTO chats (data) VALUES ($1) RETURNING id;',
            [{}]
        );
        return results.rows[0].id;
    } catch (e) {
        console.error(e);
        return null;
    }
}

const createContact = async (userOne, userTwo, chatId) => {
    try {
        const results = await pool.query(
            'INSERT INTO users_chats (user_id, other_user_id, chat_id) VALUES ($1, $2, $3) RETURNING chat_id;',
            [userOne, userTwo, chatId]
        );
        return results.rowCount;
    } catch (e) {
        console.error(e);
        return null;
    }
}

const checkContactExists = async (userOne, userTwo) => {
    try {
        const results = await pool.query(
            'SELECT * FROM users_chats WHERE user_id = $1 AND other_user_id = $2;',
            [userOne, userTwo]
        );
        return results.rowCount === 1;
    } catch (e) {
        console.error(e);
        return null;
    }
}

module.exports = {
    getUserContacts,
    getUserId,
    createChat,
    createContact,
    checkContactExists,
}