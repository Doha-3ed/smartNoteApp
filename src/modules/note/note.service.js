import OpenAI from "openai";
import noteModel from "../../DB/models/note.model.js";
import { asyncHandler } from "../../utilities/globalErrorHandling.js";
export const addNote=asyncHandler(async(req,res,next)=>{
const {title,content}=req.body
const note=await noteModel.create({title,content,userId:req.user._id})
return res.status(201).json({msg:"note added successfully",note})
})

export const deleteNote=asyncHandler(async(req,res,next)=>{
const {noteId}=req.params
const note=await noteModel.findOne({_id:noteId,userId:req.user._id})
if(!note){
    return next(new Error("note not found"))
}
await noteModel.deleteOne({_id:noteId,userId:req.user._id})
return res.status(201).json({msg:"note deleted successfully"})
})

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

export const summeriesNotes = asyncHandler(async (req, res, next) => {
  const { noteId } = req.params;

  const note = await noteModel.findOne({ _id: noteId, userId: req.user._id });
  if (!note) {
    return next(new Error("Note not found"));
  }
const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
    
      {
        role: "user",
        content: `Summarize this note:\n\n${note.content}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 256,
  });

  const summary = response.choices[0]?.message?.content?.trim();



  return res.status(200).json({
    msg: "Note summarized successfully",
    summary,
  });
});