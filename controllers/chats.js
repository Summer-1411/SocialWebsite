
const moment  =require("moment");
const jwt  =require("jsonwebtoken");
const db = require('../connect.js')

//Lấy ra các đoạn chat của user theo id

// SELECT DISTINCT `users`.`id`, `users`.`name`, `users`.`username`, `users`.`profilePic`
// FROM `users`
// JOIN `chats` ON `chats`.`user_id1` = `users`.`id` OR `chats`.`user_id2` = `users`.`id`
// WHERE `users`.`id` != 1
// AND (`chats`.`user_id1` = 1 OR `chats`.`user_id2` = 1)

//GET các đoạn chat
const getAllChats = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = `SELECT DISTINCT users.id, users.name, users.profilePic, lastMessage, chats.id as idChat
                    FROM users
                    JOIN chats ON chats.user_id1 = users.id OR chats.user_id2 = users.id
                    WHERE users.id != ${userInfo.id} AND (chats.user_id1 = ${userInfo.id} OR chats.user_id2 = ${userInfo.id}) AND chats.texted=${1}`;
        console.log(userInfo.id);
        const values = [
            ,
            userInfo.id,
            userInfo.id,
        ];

        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};

const getMemberChat = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const id = req.params.id
        const q = `SELECT user_id1, user_id2 FROM chats WHERE id = ${id}`
        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data[0]);
        });
    });
};
// setInterval(() => {
//     console.log("hihi");
// }, 3000)


const findChat = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const memberChat = Number(req.query.member)
        const q = `SELECT * FROM chats
                    WHERE (chats.user_id1 = ${userInfo.id} AND chats.user_id2 = ${memberChat}) OR (chats.user_id1 = ${memberChat} AND chats.user_id2 = ${userInfo.id})`;
        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};

const checkChatNoMessage = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const id = req.params.id
        const q = `SELECT * FROM chats
                    WHERE id = ${id} AND texted = 1`;
        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};


const updateLastMessage = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const id = req.params.id
        const mes = req.body.mes
        console.log(mes, id);
        const q = `UPDATE chats SET lastMessage = "${mes}" WHERE id = ${id}`;
        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({ success: true, message: "Update successfully " });
            //return res.status(200).json(data);
        });
    });
};


const updateStatusChat = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const id = req.params.id
        const q = `UPDATE chats SET texted = 1 WHERE id = ${id}`;
        
        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({ success: true, message: "Update successfully " });
            //return res.status(200).json(data);
        });
    });
};




const createChat = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        
        const q = "INSERT INTO chats (`user_id1`, `user_id2`) VALUES (?)";
        const values = [
            userInfo.id,
            req.body.receiver
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            const chatId = data.insertId;
            return res.status(200).json({ chatId });
            //return res.status(200).json(data);
        });
    });
};

module.exports = {
    createChat,
    updateStatusChat,
    updateLastMessage,
    checkChatNoMessage,
    findChat,
    getAllChats,
    getMemberChat
}