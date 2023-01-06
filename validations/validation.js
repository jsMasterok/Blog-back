import { body } from "express-validator";

export const registerValidation = [
  body("email").isEmail(),
  body("password").isLength({
    min: 8,
  }),
  body("fullName").isLength({
    min: 2,
  }),
  body("avatar").optional().isURL(),
];

export const loginValidation = [
  body("email").isEmail(),
  body("password").isLength({
    min: 8,
  }),
];

export const postCreateValidation = [
  body("title").isLength({ min: 3 }).isString(),
  body("text").isLength({ min: 10 }).isString(),
  body("tags").optional().isArray(),
  body("imageUrl").optional().isURL(),
];
