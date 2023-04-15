
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

const getUser = (req, res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id=?";

    try {
        db.query(q, [userId], (err, data) => {
            if (err) return res.status(500).json(err);
            const { password, ...info } = data[0];
            return res.json(info);
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

export { getUser,updateUser }