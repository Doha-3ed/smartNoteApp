import Joi from "joi";
import { gender, OTPtypes, role } from "../../utilities/enums.js";
import {generalRules }from "../../utilities/generalRules.js";
//----------------------------------------------------------signUpSchema----------------------------------------------------------------------------
export const signUpSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(30).required(),

    password: generalRules.password.required(),
    confirmPassword: Joi.valid(Joi.ref("password")).required(),

    mobileNumber: Joi.string()
      .pattern(/^[+]?[0-9]{10,15}$/)
      .required(),

  gender: Joi.string().valid(...Object.values(gender)).required(),
    age: Joi.number().min(18).max(100).required(),

    email: generalRules.email.required(),
  
  }),

  file: Joi.object({
    profilePic: Joi.object({
      secure_url: Joi.string(),
      public_id: Joi.string(),
    }).optional()
  }),
};

//----------------------------------------------------------confirmEmailSchema----------------------------------------------------------------------------
export const confirmEmailSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    code: Joi.string().length(4).required(),
  }),
};
//----------------------------------------------------------confirmOTPSchema----------------------------------------------------------------------------
export const confirmOTPSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    code: Joi.string().length(4).required(),
    type: Joi.string()
      .valid(...Object.values(OTPtypes))
      .required(),
  }),
};

//----------------------------------------------------------logInSchema----------------------------------------------------------------------------
export const loginSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    password: generalRules.password.required(),
  }),
};


//----------------------------------------------------------refreshTokenSchema----------------------------------------------------------------------------
export const refreshTokeSchema = {
  headers: generalRules.headers.required(),
};

//----------------------------------------------------------forgetPasswordSchema----------------------------------------------------------------------------
export const forgetPasswordSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
  }),
};

//----------------------------------------------------------resetPasswordSchema----------------------------------------------------------------------------
export const resetPasswordSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    code: Joi.string().required(),
    newPassword: generalRules.password.required(),
    cPassword: Joi.valid(Joi.ref("newPassword")).required(),
  }),
};

//----------------------------------------------------------softDeleteSchema----------------------------------------------------------------------------
export const softDeleteSchema = {
  headers: generalRules.headers.required(),
};

//----------------------------------------------------------uploadProfilePicSchema----------------------------------------------------------------------------
export const uploadProfilePicSchema = {
  file: generalRules.file.optional(),

  headers: generalRules.headers.required(),
};
