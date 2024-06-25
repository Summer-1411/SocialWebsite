const express  =require("express");
const cors  =require("cors");
const multer  =require("multer");
const cookieParser  =require("cookie-parser");
const userRoute = require("./routes/users.js")
const postRoute = require("./routes/posts.js")
const likeRoute = require("./routes/likes.js")
const commentRoute = require("./routes/comments.js")
const authRoute = require("./routes/auth.js")
const relationshipRoute = require("./routes/relationships.js")
const chatRoute = require("./routes/chat.js")
const messageRoute = require("./routes/message.js")
const storyRoute = require("./routes/story.js")



const app = express()


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
}))
app.use(cookieParser())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
});





app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/likes", likeRoute)
app.use("/api/comments", commentRoute)
app.use("/api/relationships", relationshipRoute)
app.use("/api/chats", chatRoute)
app.use("/api/messages", messageRoute)
app.use("/api/stories", storyRoute)


const server = app.listen(8800, () => {
    console.log("API Working in 8800");
})