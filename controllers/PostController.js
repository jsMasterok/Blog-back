import { json } from "express";
import PostModel from "../models/Post.js";

import { validationResult } from "express-validator";

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    );
    res.json({
      message: "Success Update",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Post don't updated",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndRemove(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Delete is wrong",
          });
        }
        if (!doc) {
          res.status(404).json({
            message: "Post Undefined",
          });
        }

        res.json({
          message: "Success delete",
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Wrong Delete",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    json.status(404).json({
      message: "Error with get all posts",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: `after`,
      },

      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Getting post error",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Post Undefined",
          });
        }
        res.json(doc);
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Global Post Error",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something wrong",
    });
  }
};
