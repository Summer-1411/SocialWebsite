import { db } from "../connect.js"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

const register = (req, res) => {
    //Check user if exists
    const q = "SELECT * FROM users WHERE username = ?"

    db.query(q, [req.body.username], (err, data) => {
        if(err){
            return res.status(500).json(err)
        }
        if(data.length)
        {
            return res.status(409).json("Tài khoản đã tồn tại !")
        }
        //hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)

        //create user
        const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE(?)"

        const values = [req.body.username, req.body.email, hashedPassword, req.body.name]
        db.query(q, [values], (err,data)=>{
            if(err){
                return res.status(500).json(err)
            }
            return res.status(200).json("Dang ky thanh cong *")
        })
    })
}

const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?"

    db.query(q, [req.body.username], (err, data) => {
        if(err) return res.status(500).json(err);
        if(data.length === 0)
        {
            return res.status(404).json("Username khong ton tai !");
        }
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)
        if(!checkPassword){
            return res.status(400).json("Ten dang nhap hoac mat khau khong chinh xac !")
        }
        const token = jwt.sign({
            id: data[0].id,
        }, "secretkey")
        const {password, ...others} = data[0]
        res.cookie("accessToken", token, {
            httpOnly: true
        }).status(200).json(others)
    })
}

const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(200).json("Nguoi dung da dang xuat")
}


export {
    login,
    logout,
    register
}