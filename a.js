// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");

// const app = express();
// app.use(bodyParser.json());

// // MongoDB-тэй холболт үүсгэх
// mongoose
//   .connect("mongodb://localhost:27017/facebook-clone", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB холбогдлоо"))
//   .catch((err) => console.log(err));

// // Загвар үүсгэх
// const PostSchema = new mongoose.Schema({
//   content: String,
//   comments: [
//     {
//       text: String,
//       date: { type: Date, default: Date.now },
//     },
//   ],
//   date: { type: Date, default: Date.now },
// });

// const Post = mongoose.model("Post", PostSchema);

// // 1. Пост оруулах
// app.post("/api/posts", async (req, res) => {
//   const { content } = req.body;

//   const newPost = new Post({ content });
//   await newPost.save();

//   res.status(201).json(newPost);
// });

// // 2. Коммент бичих
// app.post("/api/posts/:id/comments", async (req, res) => {
//   const { text } = req.body;
//   const postId = req.params.id;

//   const post = await Post.findById(postId);
//   if (!post) return res.status(404).json({ error: "Пост олдсонгүй" });

//   post.comments.push({ text });
//   await post.save();

//   res.json(post);
// });

// // 3. Коммент засах
// app.put("/api/posts/:postId/comments/:commentId", async (req, res) => {
//   const { text } = req.body;
//   const { postId, commentId } = req.params;

//   const post = await Post.findById(postId);
//   if (!post) return res.status(404).json({ error: "Пост олдсонгүй" });

//   const comment = post.comments.id(commentId);
//   if (!comment) return res.status(404).json({ error: "Коммент олдсонгүй" });

//   comment.text = text;
//   await post.save();

//   res.json(post);
// });

// // 4. Коммент устгах
// app.delete("/api/posts/:postId/comments/:commentId", async (req, res) => {
//   const { postId, commentId } = req.params;

//   const post = await Post.findById(postId);
//   if (!post) return res.status(404).json({ error: "Пост олдсонгүй" });

//   post.comments.id(commentId).remove();
//   await post.save();

//   res.json(post);
// });

// // Сервер ажиллуулах
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Сервер ${PORT} дээр ажиллаж байна`));

const express = require("express");
const PORT = 8000;
const app = express();
app.use(express.json());
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// 2. Post read
// 4. User Read

// 1. Post create
// 3. User create

app.get("/users", async (req, res) => {
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);

  res.send(result.users);
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);

  const user = result.users.find((el) => el.userId === id);

  if (!user) {
    res.status(404);
    res.send(`user not found following id = ${id}`);
    return;
  }

  res.send(user);
});

app.get("/posts", async (req, res) => {
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);

  res.send(result.posts);
});

app.get("/post/:asd", async (request, response) => {
  const { asd } = request.params;

  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);

  const post = result.posts.find((el) => el.postId === asd);

  if (!post) {
    response.status(404);
    response.send(`Cannot find following post by this id = ${asd}`);
    return;
  }
  const commentsOfThisPost = result.comments.filter((el) => el.postId == asd);

  response.send({
    post: post,
    comments: commentsOfThisPost,
  });
});

app.post("/post", async (req, res) => {
  const { desc, image, userId } = req.body;
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  const postId = uuidv4();
  const publishedAt = new Date().toISOString();

  result.posts.push({
    postId: postId,
    userId: userId,
    description: desc,
    image: image,
    publishedAt: publishedAt,
  });

  await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");

  res.send("Succesfully created post");
});

app.post("/comment", async (req, res) => {
  const { postId, userId, text } = req.body;
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  const publishedAt = new Date().toISOString();

  result.comments.push({
    text,
    postId,
    userId,
    publishedAt,
  });

  await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");

  res.send("Succesfully created comment");
});

app.put("/comment/:id", async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);

  const updateHiihGjBuiComments = result.comments.map((el) => {
    if (el.commentId == id) {
      return { ...el, text: text };
    } else {
      return el;
    }
  });

  result.comments = updateHiihGjBuiComments;

  await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");

  res.send("Succesfully updated comment");
});

app.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});
