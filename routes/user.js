const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const me = await User.findById(req.userId).select("_id username createdAt");
  return res.json(me);
});

module.exports = router;
