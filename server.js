const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/auth", (req, res) => {
  console.log("hit");
  res.send({ test: "test" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
