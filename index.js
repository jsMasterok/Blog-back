import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations/validation.js";
import checkAuth from "./utils/checkAuth.js";
import { register, login, auth } from "./controllers/UserController.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "./controllers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

// Storage for Images
const storage = multer.diskStorage({
  destination: (first, second, cb) => {
    cb(null, "uploads");
  },
  filename: (first, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});
//

// Connect to DB
mongoose
  .connect("mongodb+srv://Admin:5m32yyoo@cluster0.rq2cjgr.mongodb.net/blog")
  .then(() => {
    console.log("DB OK!");
  })
  .catch((err) => {
    console.warn(err, "Error");
  });
//

// Create App and config
const app = express();
app.use(express.json());
app.use(cors())
//
// Add this for app understand images directory
app.use("/uploads", express.static("uploads"));
//
// Enter Point
app.get("/", (req, res) => {
  res.send("Server Start");
});
//
// Port
app.listen(4444, (err) => {
  if (err) {
    return console.warn(err, "Error");
  }
  console.log("Server OK!");
});
//

// Auth routes
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  register
);
app.post("/auth/login", loginValidation, handleValidationErrors, login);
app.get("/auth/profile", checkAuth, auth);
//
// Posts routes
app.get("/posts", getAll, (req, res) => {});
app.get("/posts/:id", getOne, (req, res) => {});
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  create,
  (req, res) => {}
);
app.delete("/posts/:id", checkAuth, remove, (req, res) => {});
app.patch(
  "/posts/:id",
  checkAuth,
  handleValidationErrors,
  update,
  (req, res) => {}
);
//
// Add image
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  try {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  } catch (error) {
    console.log(error);
  }
});
//
