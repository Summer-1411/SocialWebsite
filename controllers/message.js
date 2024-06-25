const moment  =require("moment");
const jwt  =require("jsonwebtoken");
const db = require('../connect.js')


const getMessage = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "SELECT messages.*, users.profilePic FROM messages INNER JOIN users ON users.id = messages.userSend_id WHERE chat_id = ? ORDER BY sentTime";
        const values = [
            req.params.chatId,
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};

const sendMessage = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "INSERT INTO messages (`chat_id`, `userSend_id`, `text`, `img`) VALUES (?)";
        const values = [
            req.body.chatId,
            userInfo.id,
            req.body.text,
            req.body.img
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            const messId = data.insertId;
            return res.status(200).json({success: true, message: "Send message", id: messId});
        });
    });
};
const getMessageById = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "SELECT messages.*, users.profilePic FROM messages INNER JOIN users ON users.id = messages.userSend_id WHERE messages.id = ?";
        const values = [
            req.params.id,
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data[0]);
        });
    });
};



const deleteMessage = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = `UPDATE messages SET deleted = 1 WHERE userSend_id = ${userInfo.id} AND id = ${req.params.id}`;


        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({message: "Delete message success", mes: data});
        });
    });
};

module.exports = {
    deleteMessage,
    getMessageById,
    sendMessage,
    getMessage
}