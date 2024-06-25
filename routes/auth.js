const express = require('express')
const { login, logout, register } = require('../controllers/auth.js')

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/", (req, res) => {
    res.send(
        "Hello word"
    )
})

module.exports = router
