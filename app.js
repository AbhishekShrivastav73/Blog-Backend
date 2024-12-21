const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
const mongooseConnection = require("./config/mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const userRoutes = require("./routes/user.routes");
const path = require("path");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth/", authRoutes);
app.use("/api/post/", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
