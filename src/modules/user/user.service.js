import userModel from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utilities/globalErrorHandling.js";
import { compare, generateToken, hash } from "../../utilities/security/index.js";
import { eventemit } from "../../utilities/sendEmail.event.js";
import cloudinary from "../../utilities/cloudinary/index.js";
import { OTPtypes, provider, role } from "../../utilities/enums.js";
//-------------------------------------------------------------SignUp------------------------------------------------------------------------
export const signUp = asyncHandler(async (req, res, next) => {
    const {name , email, password , mobileNumber,gender,age} = req.body;
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return next(new Error("User already exist"));
    }
    const Hashing = await hash({
      key: password,
      SALT_ROUND: process.env.SALT_ROUND,
    });
    let profilePic = {};
  
  if (req.files?.profilePic) {
    const result = await cloudinary.uploader.upload(
      req.files.profilePic[0].path
    );
    profilePic = { secure_url: result.secure_url, public_id: result.public_id };
  }

 
     eventemit.emit("sendEmail", { email });

    const user = await userModel.create({
      name,
      email,
      password: Hashing,
      mobileNumber,
      age,
      gender,
      profilePic,
    });
    res.status(201).json({ msg: "you signedUp Successfully", user });
    
})
//-----------------------------------------------------------------confirmEmail--------------------------------------------------------------------
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  const userExist = await userModel.findOne({ email, isConfirmed: false });
  if (!userExist) {
    return next(new Error("User not found"));
  }
  const otp = userExist.OTP.find(
    (otpType) =>
      otpType.type === OTPtypes.cEmail && otpType.expiresIn > new Date()
  );
  if (!otp) {
    return next(new Error("invalid OTP"));
  }
  const isMatch = await compare({ key: code, HashedKey: otp.code });
  if (!isMatch) {
    return next(new Error("code isnot Correct"));
  }
  const user = await userModel.findOneAndUpdate(
    { email },
    { isConfirmed: true, $push: { OTP: { type: OTPtypes.cEmail } } },
    { new: true }
  );
  res.status(201).json({ msg: "done", user });
});
//-----------------------------------------------------------------SignIn--------------------------------------------------------------------
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await userModel.findOne({
    email,
    provider: provider.system,
    isConfirmed: true,
  });
  if (!userExist) {
    return next(new Error("User not found"));
  }
  const checkPass = await compare({
    key: password,
    HashedKey: userExist.password,
  });
  if (!checkPass) {
    return next(new Error("password not match"));
  }
  const refreshToken = await generateToken({
    payload: { email, userId: userExist._id },
    PRIVATE_KEY:
      userExist.role == role.user ?
        process.env.SIGNATURE_user
      : process.env.SIGNATURE_admin,
    expired: "7d",
  });
  const accessToken = await generateToken({
    payload: { email, userId: userExist._id },
    PRIVATE_KEY:
      userExist.role == role.user ?
        process.env.SIGNATURE_user
      : process.env.SIGNATURE_admin,
    expired: "1h",
  });

  res.status(201).json({
    msg: "you logedIn successfully",
    Token: {
      accessToken,
      refreshToken,
    },
  });
});

//-----------------------------------------------------------------forgetPassword--------------------------------------------------------------------
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email, isDeleted: false });

  if (!user) {
    return next(new Error("user not found ,try again "));
  }
  eventemit.emit("forgetPassword", { email });

  res.status(200).json({ msg: "done" });
});
//-----------------------------------------------------------------resetPassword--------------------------------------------------------------------
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, newPassword } = req.body;
  const userExist = await userModel.findOne({ email, isDeleted: false });
  if (!userExist) {
    return next(new Error("User not found"));
  }
  const otp = userExist.OTP.find(
    (otpType) =>
      otpType.type === OTPtypes.forgetPassword && otpType.expiresIn > new Date()
  );
  if (!otp) {
    return next(new Error("invalid OTP"));
  }
  const isMatch = await compare({ key: code, HashedKey: otp.code });
  if (!isMatch) {
    return next(new Error("code isnot Correct"));
  }
  const Hashing = await hash({
    key: newPassword,
    SALT_ROUND: process.env.SALT_ROUND,
  });
  const user = await userModel.findOneAndUpdate(
    { email },
    {
      confirmed: true,
      $push: { OTP: { type: OTPtypes.forgetPassword } },
      password: Hashing,
    },
    { new: true }
  );
  res.status(201).json({ msg: "done", user });
});
//-----------------------------------------------------------------refreshToken--------------------------------------------------------------------
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const user = await decodedToken({
    authorization,
    tokenType: tokenTypes.access,
  });
  const accessToken = await generateToken({
    payload: { email: user.email, userId: user._id },
    PRIVATE_KEY:
      user.role == role.user ?
        process.env.SIGNATURE_user
      : process.env.SIGNATURE_admin,
    expired: "1h",
  });

  res.status(201).json({
    msg: "token is refreshed",
    Token: {
      accessToken,
    },
  });
});
//-----------------------------------------------------------------confirmOTP--------------------------------------------------------------------

export const confirmOTP = asyncHandler(async (req, res, next) => {
  const { email, code, type } = req.body;

  const userExist = await userModel.findOne({ email });
  if (!userExist) {
    return next(new Error("User not found"));
  }
  const otp = userExist.OTP.find(
    (otpType) => otpType.type === type && otpType.expiresIn > new Date()
  );

  if (!otp) {
    return next(new Error("Invalid or expired OTP"));
  }

  const isMatch = await compare({ key: code, HashedKey: otp.code });
  if (!isMatch) {
    return next(new Error("Incorrect OTP"));
  }
  if (type === OTPtypes.cEmail) {
    await userModel.updateOne(
      { email },
      { isConfirmed: true, $pull: { OTP: { type: type } } }
    );
    return res.status(200).json({ msg: "Email confirmed successfully" });
  }
  if (type === OTPtypes.forgetPassword) {
    await userModel.updateOne({ email }, { $pull: { OTP: { type: type } } });
    return res.status(200).json({
      msg: "OTP verified successfully. You can now reset your password.",
    });
  }

  return next(new Error("Invalid OTP type"));
});
//------------------------------------------logout---------------------------------------------------

export const logout = asyncHandler(async (req, res, next) => {
   const user = await userModel.findOne({ _id: req.user._id, isDeleted: false });
  if (!user) {
    return next(new Error("user not Found"));
  }

  await userModel.findOneAndUpdate(
    { _id: user._id },
    { isDeleted: true, deletedAt: new Date() ,changeCredentialTime:new Date()},
    { new: true }
  );

  res.status(201).json({ msg: "softDelete is Done" });
});
//-------------------------------------------------uploadProfile---------------------------------------------------
export const uploadProfile = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("No file uploaded"));
  }

  const currentUser = await userModel.findById(req.user._id);

  // Delete the old image if it is not the default
  if (currentUser.profileImage?.public_id && currentUser.profileImage.public_id !== "default-image") {
    await cloudinary.uploader.destroy(currentUser.profileImage.public_id);
  }

  // Upload the new image
  const profile = await cloudinary.uploader.upload(req.file.path, {
    folder: 'users',
  });

  // Update user's profile image
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      profileImage: {
        secure_url: profile.secure_url,
        public_id: profile.public_id,
      },
    },
    { new: true, lean: true }
  );

  res.status(201).json({ msg: "Profile picture updated", user: updatedUser });
});