import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    
    title: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);




const noteModel = mongoose.model.note || mongoose.model("note", noteSchema);
export default noteModel;
