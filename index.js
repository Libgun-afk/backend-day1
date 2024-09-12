/** @format */

const express = require("express");
const app = express();
const PORT = 8000;
app.use(express.json());
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const fetchData = async () => {
  const resultJson = await fs.readFileSync("./db.json", "utf-8");
  const result = JSON.parse(resultJson);
  return result;
};

app.post("/user", async (req, res) => {
  const { password, username } = req.body;
  const result = await fetchData();
  console.log(result);

  const doesExist = result.users.find((el) => el.username == username);

  if (!doesExist) {
    result.users.push({
      username,
      password,
    });
    await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");
    res.send("Succesfully created user");
  }
  res.send("iim hereglegch bn");
});

app.put("/updatePass", async (req, res) => {
  const { username, password } = req.body;
  const result = await fetchData();

  const upPass = result.users.find((el) => el.username === username);

  if (upPass.password === password) {
    res.status(400).send("Шинэ нууц үг хуучин нууц үгтэй ижил байна.");
    return;
  }

  upPass.password = password;

  await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");

  res.send("shinchille");
});

app.put("/user", async (req, res) => {
  const { username, password } = req.body;
  const result = await fetchData();

  const doesExist = result.users.find((el) => el.username == username);

  if (!doesExist || doesExist.password !== password) {
    res.status(400).send("taarsangue alio neg n");
    return;
  }
  res.send("nevterlee");
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
