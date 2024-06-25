
const moment  =require("moment");
const jwt  =require("jsonwebtoken");
const db = require('../connect.js')

const getUser = (req, res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id=?";

    try {
        db.query(q, [userId], (err, data) => {
            if (err) return res.status(500).json(err);
            //const { password, ...info } = data[0];
            return res.json(data[0]);
        });
    } catch (error) {
        return res.status(500).json("Server error !")
    }
};

const searchUser = (req, res) => {
    const name = req.query.name;
    const q = "SELECT id, name, profilePic FROM users WHERE name=?";

    try {
        db.query(q, [name], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.json(data);
        });
    } catch (error) {
        return res.status(500).json("Server error !")
    }
};





const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q =
            "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? ";

        //console.log(req.body, userInfo.id);
        try {
            db.query(
                q,
                [
                    req.body.name,
                    req.body.city,
                    req.body.website,
                    req.body.profilePic,
                    req.body.coverPic,
                    userInfo.id,
                ],
                (err, data) => {
                    if (err){
                        return res.status(500).json(err)
                    };
                    
                    return res.status(200).json("Updated!");
                }
            );
        } catch (error) {
            return res.status(500).json("Server error !")
        }
    });
};

//Những người bạn đang theo dõi
const getUserFollows = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const id = req.query.id
        const q = "SELECT * FROM users WHERE id IN (SELECT followedUserid FROM relationships WHERE followerUserid = ?)";
        let values;
        if(id){
            values = [id]
        }else {
            values = [userInfo.id]
        }
        
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({success: true, users: data});
        });
    });
};

//Những người đang theo dõi bạn
const getUserFollowed = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const id = req.query.id
        const q = "SELECT * FROM users WHERE id IN (SELECT followerUserid FROM relationships WHERE followedUserid = ?)";
        let values;
        if(id){
            values = [id]
        }else {
            values = [userInfo.id]
        }
        
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({success: true, users: data});
        });
    });
};

module.exports = { getUser,updateUser,getUserFollows, getUserFollowed,searchUser }