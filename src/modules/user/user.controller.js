import { Router } from "express";
import {validation} from "../../middleware/validation.js";
import { confirmEmailSchema, forgetPasswordSchema, loginSchema, resetPasswordSchema, signUpSchema, softDeleteSchema, uploadProfilePicSchema } from "./user.validation.js";
import { confirmEmail, forgetPassword, logout, resetPassword, signIn, signUp, uploadProfile } from "./user.service.js";
import { fileTypes, multerHost, multerLocal } from "../../middleware/multer.js";
import { authentication } from "../../middleware/authentication.js";
const userRouter = Router();

userRouter.post("/signup", multerHost(fileTypes.image).fields([
    { name: "profilePic", maxCount: 2 },
    { name: "coverPic", maxCount: 2},
  ]),validation(signUpSchema),signUp);
userRouter.post("/confirmEmail", validation(confirmEmailSchema), confirmEmail);
userRouter.post("/login",validation(loginSchema),signIn)
userRouter.patch(
  "/forgetPassword",
  validation(forgetPasswordSchema),
  forgetPassword
);
userRouter.patch(
  "/resetPassword",
  validation(resetPasswordSchema),
  resetPassword
);
userRouter.patch(
  "/logout",
  validation(softDeleteSchema),
  authentication
  ,
  logout
);
userRouter.patch(
  "/uploadProfile",
      multerHost(fileTypes.image).single("profilePic"),
  validation(uploadProfilePicSchema),authentication,
  uploadProfile
);
export default userRouter