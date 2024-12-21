const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

module.exports.addComments = async function (req, res) {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    const comment = await Comment.create({
      post: postId,
      content,
      user: req.user._id,
    });

    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

module.exports.getComments = async function (req, res) {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

module.exports.updateComments = async function (req, res) {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    comment.content = req.body.content || comment.content;
    comment.updatedAt = Date.now();

    const updatedComment = await comment.save();
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Error in updating Comments", error });
  }
};

module.exports.deleteComment = async function (req, res) {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await comment.remove();
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};
