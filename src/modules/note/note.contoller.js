import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { createNoteSchema, deleteNoteSchema, summarizeNoteSchema } from "./note.validation.js";
import { authentication } from "../../middleware/authentication.js";
import { addNote, deleteNote, summeriesNotes } from "./note.service.js";
const noteRouter = Router();

noteRouter.post("/createNote",validation(createNoteSchema),authentication,addNote)
noteRouter.delete("/:noteId",validation(deleteNoteSchema),authentication,deleteNote)
noteRouter.post("/summarizeNote/:noteId",validation(summarizeNoteSchema),authentication,summeriesNotes)


export default noteRouter   