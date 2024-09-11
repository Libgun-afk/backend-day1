/** @format */

const express = require("express");
const app = express();
const PORT = 8000;
app.use(express.json());
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

app.post("/user", async (req, res) => {
  const { password, userName } = req.body;
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  console.log(result);

  result.users.push({
    userName,
    password,
  });
  await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");

  res.send("Succesfully created user");
});

app.put("/updatePass", async (req, res) => {
  const { userName, password } = req.body;
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);

  const upPass = result.users.find((el) => el.userName === userName);

  if (!upPass || upPass.password || password !== password) {
    await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");
    res.send("done pass usk");
    return;
  }

  res.send("not");
});

app.put("/update", async (req, res) => {
  const { userName, password } = req.body;
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);

  const founded = result.users.find((el) => el.userName === userName);

  if (!founded) {
    result.users.push({
      userName,
      password,
    });
    await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");
    res.send("done");
    return;
  }

  res.send("bgan bn ushuu");
});

app.listen(PORT, () => {
  console.log(`server bla bla bla: ${PORT}...`);
});
