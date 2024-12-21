const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const {
  getUserProfile,
  updateProfile,
  followUser,
} = require("../controllers/user.controllers");
const upload = require("../config/multer");
const router = express.Router();

router.get("/:username", getUserProfile);
router.put("/update", authenticate, upload.single("image"), updateProfile);
router.post("/follow/:userId", authenticate,  followUser);


module.exports = router;
