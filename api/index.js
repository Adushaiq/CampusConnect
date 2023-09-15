const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const salt = bcrypt.genSaltSync(10);
const secret = "asdndqaq12p1iads9qj212ads";
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB");

// routes

app.post("/register", async (req, res) => {
  const { name, email, username, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      username,
      password: bcrypt.hashSync(password, salt),
    });

    res.json({ userDoc });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    console.log("Error while registering");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });

    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
      // logged in
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: userDoc._id,
          username,
          name: userDoc.name,
        });
      });
    } else {
      res.status(400).json("Wrong Credentials 2");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;

    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    console.log(info);
    res.json(postDoc);
  });
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    postDoc.cover = newPath ? newPath : postDoc.cover;
    await postDoc.save();

    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username", "name"])
      .sort({ createdAt: -1 })
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const PostDoc = await Post.findById(id).populate("author", [
    "username",
    "name",
  ]);
  res.json(PostDoc);
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const PostDoc = await Post.findByIdAndDelete(id);

    if (!PostDoc) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json(PostDoc);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/comment/:id", async( req, res ) => {

    try{

        // fetch data from the request 
        const {post, user, content} = req.body;

        // create a new comment object
        const comment = new Comment({
            post, user, content
        })

        // create a new entry for the newly created comment object
        const savedComment = await comment.save();
        
        //updating the post's data (adding comment to the post)
        const updatedPost = await Post.findByIdAndUpdate(post,{
            $push: {comments: savedComment._id}
        } , {new: true})
        .populate("comments").exec();

        console.log(updatedPost.comments);

        // sending response
        res.status(200)
        .json('ok')

    }   
    catch(error){
        console.error(error);
        console.log(error);
        res.status(500)
        .json({
            success:false,
            message: error.message,
        })
    }
})

app.get("/comment/" , async (req, res) => {
  res.json(
    await Comment.find()
      .sort({ createdAt: -1 })
  )
})

app.listen(4000);
