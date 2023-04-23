import jwt from "jsonwebtoken";
import { db } from "../connect.js"
import moment from "moment";
// const getPosts = (req, res) => {
//     const token = req.cookies.accessToken;
//     if(!token){
//         return res.status(401).json('Not logged in !');
//     }
//     jwt.verify(token, "secretkey", (err,userInfo) => {
//         if(err){
//             return res.status(403).json('Token is not valid !');
//         }	
//         console.log({userInfo});
//         // const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userid)
//         // JOIN relationships AS r ON (p.userId = r.followedUserid AND r.followerUserid = ?)`

//         const q  = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
//         LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
//         ORDER BY p.createdAt DESC`
//         db.query(q, [userInfo.id, userInfo.id],  (err,data) => {
//             if(err){
//                 return res.status(500).json(err)
//             }
//             console.log({data});
//             return res.status(200).json(data)
//         })
//     })

// }
const getPosts = (req, res) => {
    const userId = req.query.userId;
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");


        const q =
            userId !== "undefined"
                ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? GROUP BY p.id ORDER BY p.createdAt DESC`
                : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
                LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
                GROUP BY p.id
                ORDER BY p.createdAt DESC`;

        
        
        let values
        if (userId !== "undefined") {
            values = [userId]
        } else {
            values = [userInfo.id, userInfo.id];
        }
        

        console.log({userId});
        console.log('re-render');
        db.query(q, values, (err, data) => {
            

            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};
const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json('Not logged in !');
    }
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(403).json('Token is not valid !');
        }

        const q =
            "INSERT INTO posts(`description`, `img`, `createdAt`, `userId`) VALUES (?)";
        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
        ];
        db.query(q, [values], (err, data) => {
            if (err) {
                return res.status(500).json(err)
            }
            console.log({ data });
            return res.status(200).json("Bài đăng đã được tạo.")
        })
    })

}
const deletePost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q =
            "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");
            return res.status(403).json("You can delete only your post")
        });
    });
};




export {
    getPosts,
    addPost,
    deletePost
}