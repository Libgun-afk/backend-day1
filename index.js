const express = require("express");
const PORT = 8000;
const app = express();
app.use(express.json());
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

app.get("/users", async (req, res) => {
  const resultJson = await fs.readFileSync("db.json", "utp-8");
  const result = JSON.parse(resultJson);

  res.send(result.users);
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  const resultJson = await fs.readFileSync("db.json", "utp-8");
  const result = JSON.parse(resultJson);

  const user = result.users.find((el) => el.userId === id);

  if (!user) {
    res.status(404);
    res.send(`not = ${id}`);
    return;
  }
});

app.listen(PORT, () => {
  console.log(`localhost${PORT}`);
});
