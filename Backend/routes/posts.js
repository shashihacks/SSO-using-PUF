const express = require("express");
const router = express.Router();

const posts = [
  {
    username: "Kyle",
    title: "Post 1",
  },
  {
    username: "Jim",
    title: "Post 2",
  },
];

router.get("/", async (req, res) => {
  console.log("posts requested");
  res.json(posts);
});

module.exports = router;
