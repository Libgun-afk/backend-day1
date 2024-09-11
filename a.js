/** @format */

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

// app.put("/comment/:id", async (req, res) => {
//   const { text } = req.body;
//   const { id } = req.params;
//   const resultJson = await fs.readFileSync("./db.json", "utf-8");
//   const result = JSON.parse(resultJson);

//   const updateHiihGjBuiComments = result.comments.map((el) => {
//     if (el.commentId == id) {
//       return { ...el, text: text };
//     } else {
//       return el;
//     }
//   });

//   result.comments = updateHiihGjBuiComments;

//   await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");

//   res.send("Succesfully updated comment");
// });

app.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});

//
//
//

app.post("/user", async (request, response) => {
  const newUser = request.body;

  if (!newUser || !newUser.id || !newUser.name) {
    return response.status(400).send("Invalid user data");
  }

  try {
    // JSON файлыг унших
    const resultJson = await fs.readFile("./db.json", "utf-8");
    const result = JSON.parse(resultJson);

    // Шинэ хэрэглэгчийг нэмэх
    result.users = result.users || [];
    result.users.push(newUser);

    // JSON файлыг шинэчлэн бичих
    await fs.writeFile("./db.json", JSON.stringify(result, null, 2));

    // Амжилттай хариу илгээх
    response.status(201).send("User added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
    response.status(500).send("Internal Server Error");
  }
});
//
//
//
//
// db.json dotor bga buh hereglegchid

app.get("/users", async (req, res) => {
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  res.send(result.users);
});

app.get("/posts", async (req, res) => {
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  res.send(result.posts);
});

app.get("/comments", async (req, res) => {
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  if (result.length === 0) {
    res.status(404).res.send(`hooson bna`);
  }
  {
    res.send(result.comments);
  }
});

// hereglegchiig id gaar n oloh

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);

  const user = result.users.find((el) => el.userId === id);
  if (!user) {
    res.status(404);
    res.send(`user not found = ${id}`);
    return;
  }
  res.send(user);
});

// id gaar n post -iig oloh

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;

  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);

  const post = result.posts.find((el) => el.postId === id);

  if (!post) {
    res.status(404);
    res.send(`Энэ id-р дараах нийтлэлийг олж чадсангүй ${id}`);
  }

  const commentsOfThisPost = res.comment.filter((el) => el.postId == id);

  res.send({
    post: post,
    comments: commentsOfThisPost,
  });
});
app.post("/user", async (req, res) => {
  const { userId, username, profilePic } = req.body;
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  const publishedAt = new Date().toISOString();

  result.users.push({
    userId,
    username,
    profilePic,
    publishedAt,
  });
  await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");

  res.send("Succesfully created user");
});

app.post("/post", async (req, res) => {
  const { desc, image, title, userId } = req.body;
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  const postId = uuidv4();
  const publishedAt = new Date().toISOString();

  result.posts.push({
    postId: postId,
    userId: userId,
    description: desc,
    image: image,
    title: title,
    publishedAt: publishedAt,
  });

  await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");

  res.send("Succesfully created post");
});

app.post("/comment", async (req, res) => {
  const { userId, text } = req.body;
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  const postId = uuidv4();
  const publishedAt = new Date().toISOString();

  result.comments.push({ text, postId, userId, publishedAt });

  await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");

  res.send("Succesfully created commennt");
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

// const express = require("express");
// const PORT = 8000;
// const app = express();
// app.use(express.json());
// const fs = require("fs");
// const { v4: uuidv4 } = require("uuid");
// const { fetchData } = require("./helper");

app.post("/users", async (req, res) => {
  const { username, password } = req.body;
  const result = await fetchData();

  const doesExist = result.users.find((el) => el.username == username);

  if (!doesExist) {
    result.users.push({
      username,
      password,
    });
    await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");
    res.send("amjillttai");
    return;
  }

  res.send("bnshde");
});

app.put("/users", async (req, res) => {
  const { username, password } = req.body;
  const result = await fetchData();

  const doesExist = result.users.find((el) => el.username == username);

  if (!doesExist || doesExist.password !== password) {
    res.status(400).send("taarsngue ali neg n");
    return;
  }

  res.send("nevterlee");
});

app.listen(PORT, () => {
  console.log(`enender asav localhost${PORT}`);
});

const express = require("express");
const PORT = 8000;
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

app.post("/user", async (req, res) => {
  const { username, password } = req.body;
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  const doesExist = result.users.find((el) => el.username == username);

  if (!doesExist) {
    result.users.push({
      username,
      password,
    });
    await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8")
    res.send("amjilttai nemegdlee")
    return;
  }
  result.users.push({
    username,
    password,
    code: "",
  });
  await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");
  res.send("amjilttai");
});

app.put("/user", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);

  const doesExist = result.users.find((el) => el.username == username);
  if (password !== confirmPassword) {
  }

  if (!doesExist || doesExist.password !== password) {
    res.status(400).send("taarsngue ali neg n");
    return;
  }

  res.send("nevterlee");
});

app.post("/hash", async (req, res) => {
  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);

  console.log(result.users);

  result.users.push({
    password: hashedPassword,
  });

  await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");

  res.send(hashedPassword);
});

app.put('/forgot'){
  const {email} = req.body
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  const doesExist = result.users.find((el) => el.username == username);
  const randomCode = Math.floor(Math.random*9999)
  doesExist.code = 'randomCode'
}

app.put('/confirm'){
  const {email,code,password} = req.body

  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  const doesExist = result.users.find((el) => el.username == username);
  doesExist.code == code
  doesExist.code = 'randomCode'
}

app.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});
