const pool = require('../config/db');

const getChat = async (id) => {
    try {
        const results = await pool.query(
            'SELECT * FROM chats WHERE id = $1;',
            [id]
        );
        
        return results.rowCount === 1 ? results.rows[0] : null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

const updateChat = async (data, id) => {
    try {
        const results = await pool.query(
            'UPDATE chats SET data = $1 WHERE id = $2;',
            [data, id]
        );
        
        return true;
    } catch (e) {
        console.error(e);
        return null;
    }
}

const getUser = async (id) => {
    try {
        const results = await pool.query(
            'SELECT id, username, last_request, show_status, active FROM users WHERE id=$1;',
            [id]
        );
        
        return results.rowCount === 1 ? results.rows[0] : null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

module.exports = {
    getChat,
    updateChat,
    getUser
}