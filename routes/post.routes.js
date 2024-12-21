const express = require("express");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  getMyPosts,
} = require("../controllers/post.controllers");
const authenticate = require("../middlewares/auth.middleware");
const upload = require("../config/multer");
const router = express.Router();


router.get('/myposts',authenticate,getMyPosts)
router.post("/", authenticate, upload.single("image"), createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", authenticate, upload.single("image"), updatePost);
router.delete("/:id", authenticate, deletePost);
router.post("/like/:postId", authenticate, toggleLike);

module.exports = router;
