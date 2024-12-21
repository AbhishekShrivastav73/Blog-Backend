const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const { addComments, updateComments, getComments } = require("../controllers/comment.controllers");
const router = express.Router();

router.post("/:postId", authenticate, addComments);
router.get("/:postId", getComments);
router.put("/:commentId", authenticate, updateComments);
router.delete("/:commentId", authenticate, updateComments);


module.exports = router;
