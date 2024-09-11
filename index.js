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
  const { password, userName } = req.body;
  const result = await fetchData();
  console.log(result);

  const doesExist = result.users.find((el) => el.userName == userName);

  if (!doesExist) {
    result.users.push({
      username,
      password,
    });
    await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");
    res.send("Succesfully created user");
  }
  result.users.push({
    username,
    password,
    code: "",
  });
  await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");
  res.send("iim hereglegch bn");
});

app.put("/updatePass", async (req, res) => {
  const { username, password, newPass } = req.body;
  const result = await fetchData();

  const upPass = result.users.find((el) => el.username === username);
  // const newUpPass = result.users.find((el) => el.)

  if (!upPass || upPass.password || password !== password) {
    await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");
    res.send("done pass usk");
    return;
  }

  res.send("not");
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

app.post("/hash", async (req, res) => {
  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await fetchData();

  result.users.push({
    password: hashedPassword,
  });

  await fs.writeFileSync("./db.json", JSON.stringify(result), "utf-8");
  res.status(200);
  res.send(hashedPassword);
});

// app.put('/forgot'){
//   const {username} = req.body
//   const resultJson = await fs.readFileSync("./db.json", "utf-8");
//   const result = JSON.parse(resultJson);
//   const doesExist = result.users.find((el) => el.username == username);
//   const randomCode = Math.floor(Math.random*9999)
//   doesExist.code = 'randomCode'
// }

// app.put('/confirm'){
//   const {username,code,password} = req.body

//   const resultJson = await fs.readFileSync("./db.json", "utf-8");
//   const result = JSON.parse(resultJson);
//   const doesExist = result.users.find((el) => el.username == username);
//   doesExist.code == code
//   doesExist.code = 'randomCode'
// }

app.listen(PORT, () => {
  console.log(`server bla bla bla: ${PORT}...`);
});
