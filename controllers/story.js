const moment  =require("moment");
const jwt  =require("jsonwebtoken");
const db = require('../connect.js')

const getStory = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = `SELECT s.*, u.id AS userId, name, profilePic FROM stories AS s JOIN users AS u ON (u.id = s.userId)
                    LEFT JOIN relationships AS r ON (s.userId = r.followedUserId) WHERE r.followerUserId= ? OR s.userId = ?
                    GROUP BY s.id
                    ORDER BY s.createdAt DESC`;
        let values = [userInfo.id, userInfo.id];

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({success: true, story: data});
        });
    });
};

const postStory = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "INSERT INTO stories(`img`, `text`,`userid`, `createdAt`) VALUES (?)";
        const values = [
            req.body.img,
            req.body.text,
            userInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({success: true, story: data});
        });
    });
};
const deleteStory = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "DELETE FROM stories WHERE id = ?";
        const values = [
            req.params.id
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({success: true, message: "Xoá story thành công"});
        });
    });
};


const autoDeleteStory = async () => {
    const q = 'DELETE FROM stories WHERE createdAt < DATE_SUB(NOW(), INTERVAL 1 DAY)'
    // db.query(q, (err, data) => {
    //     if (err) return res.status(500).json(err);
    //     //console.log("123");
    //     //return res.status(200).json({success: true, story: data});
    // });
    await db.execute(q)
};


setInterval(autoDeleteStory, 1000*60*60*12)

module.exports = {
    getStory,
    deleteStory,
    postStory,
    autoDeleteStory
}