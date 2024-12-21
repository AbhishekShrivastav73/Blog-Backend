const userModel = require("../models/user.model");

module.exports.getUserProfile = async function (req, res) {
  try {
    const user = await userModel
      .findOne({ username: req.params.username })
      .populate("followers", "username profilePicture")
      .populate("following", "username profilePicture");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

module.exports.updateProfile = async function (req, res) {
  try {
    const { username, bio } = req.body;
    const user = await userModel.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.bio = bio || user.bio;
    if (req.file) {
      user.profilePicture = req.file.filename;
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

module.exports.followUser = async function (req, res) {
  try {
    const userToToggle = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToToggle || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = userToToggle.followers.includes(currentUser._id);

    if (isFollowing) {
      // Unfollow logic
      userToToggle.followers = userToToggle.followers.filter(
        (id) => id.toString() !== currentUser._id
      );
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userToToggle._id
      );
    } else {
      // Follow logic
      userToToggle.followers.push(currentUser._id);
      currentUser.following.push(userToToggle._id);
    }

    await userToToggle.save();
    await currentUser.save();

    res.status(200).json({
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
      isFollowing: !isFollowing,
    });
  } catch (error) {
    res.status(500).json({ message: "Error following user", error });
  }
};
