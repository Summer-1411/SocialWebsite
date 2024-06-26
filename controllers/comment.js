const moment  =require("moment");
const jwt  =require("jsonwebtoken");
const db = require('../connect.js')
const getComments = (req, res) => {
    const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
        WHERE c.postId = ? ORDER BY c.createdAt DESC
        `;

    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

const addComment = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "INSERT INTO comments(`description`, `createdAt`, `userId`, `postId`) VALUES (?)";
        const values = [
            req.body.desc,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Comment has been created.");
        });
    });
};

const deleteComment = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "DELETE FROM comments WHERE id = ?";
        const values = [
            req.params.id
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({success: true, message: "Xoá bình luận thành công"});
        });
    });
};

module.exports = {
    deleteComment,
    addComment,
    getComments
}