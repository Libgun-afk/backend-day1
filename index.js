/** @format */

const express = require("express");
const app = express();
const PORT = 8000;
app.use(express.json());
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const users = [];

// db.json dotor bga buh hereglegchid

app.get("/users", async (req, res) => {
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  res.send(result.users);
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

// app.post("/", async (req, res) => {

//   const resultJson = await fs.readFileSync("./db.json", "utf-8");
//   const result = JSON.parse(resultJson);

//   const newUser = {
//     id: uuid.v4(),
//     username:req.body.username,
//     profilePic:req.body.profilePic,
//   }

//   if (!newUser.username || !newUser.profilePic) {
//     return res.status(400).send("asd")
//   }
//   users.push(newUser)
//   res.json(users)
//   res.status(201).json(newUser);
// }

// res.send("succesfully created user");
//   const newUser = req.body;

//   if (!newUser || !newUser.id || !newUser.name) {
//     return res.status(404).send("Хэрэглэгчийн өгөгдөл буруу байна");
//   }
//   try {
//     const resultJson = await fs.readFile("./db.json", "utf-8");
//     const result = JSON.parse(resultJson);

//     res.users = result.users || [];
//     res.users.push(newUser);

//     await fs.writeFileSync("./db.json", JSON.stringify(res, null, 2));

//     res.status(201);
//     res.send("user added successfully");
//   } catch (error) {
//     console.error("error adding user:", error);
//     res.status(500);
//     res.send("Intirnal server error");
//   }
// });

//

app.listen(PORT, () => {
  console.log(`server bla bla bla: ${PORT}...`);
});
