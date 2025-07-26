import mongoose from "mongoose";
import { gender, OTPtypes, provider, role } from "../../utilities/enums.js";
import { hash } from "../../utilities/security/hash.js";
import { encrypt } from "../../utilities/security/encrypt.js";
import { decrypt } from "../../utilities/security/decrypt.js";

const userSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required:  function () { return this.provider === provider.system; },
    },
    provider: {
      type: String,
      enum: Object.values(provider),
      default: provider.system,
    },
    gender: {
      type: String,
      enum: Object.values(gender),
    },
    age:{
      type: Number,
      
    }
   ,
    mobileNumber: String,
    role: {
      type: String,
      enum: Object.values(role),
    },
    isConfirmed: {type:Boolean,
      default:false
    },
    deletedAt: Date,
    bannedAt: Date,
    changeCredentialTime: Date,
    updatedBy: { type: String, ref: "user" },
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    OTP: [
      {
        code: { type: String, required: true },
        type: { type: String, enum: Object.values(OTPtypes), required: true },
        expiresIn: { type: Date },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  

  if (this.isModified("mobileNumber")) {
    this.mobileNumber = await encrypt({
      key: this.mobileNumber,
      SECRETE_KEY: process.env.SECRETE_KEY,
    });
  }

  next();
});
userSchema.post("findById", function (data) {
  if (data?.mobileNumber) {
    data.mobileNumber = decrypt({
      key: data.mobileNumber,
      SECRETE_KEY: process.env.SECRETE_KEY,
    });
  }
});


const userModel = mongoose.model.user || mongoose.model("user", userSchema);
export default userModel;
