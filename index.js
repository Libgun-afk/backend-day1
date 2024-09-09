// const http = require("http");

// const port = 8000;

// const obj = { data: { a: 1, b: 2, c: 3 }, data2: { aa: 2 } };
// console.log(obj);

// const server = http.createServer((req, res) => {
//   const json = JSON.stringify(obj);

//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   //   res.end("hello");
//   res.end(json);
// });

// server.listen(port, () => {
//   console.log(`running on ${port} `);
// });

const express = require("express");
const port = 8000;
const app = express();

const obj = { data: { a: 1, b: 2, c: 3 }, data2: { aa: 2 } };
console.log(obj);

app.get("/", (req, res) => {
  const json = JSON.stringify(obj);
  res.send(json);
});

app.post("/", (req, res) => {
  res.send("...post");
});

app.put("/", (req, res) => {
  res.send("...put");
});

app.delete("/", (req, res) => {
  res.send("...delete");
});

app.listen(port, () => {
  console.log(obj);
});
