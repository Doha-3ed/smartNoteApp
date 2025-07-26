import Joi from "joi";
import {generalRules} from "../../utilities/generalRules.js";
export const createNoteSchema = {
    body: Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
    }),
    headers: generalRules.headers.required(),
};

export const deleteNoteSchema = {
    params: Joi.object({
        noteId: generalRules.id,
    }),
    headers: generalRules.headers.required(),
};

export const summarizeNoteSchema = {
    params: Joi.object({
        noteId: generalRules.id,
    }),
    headers: generalRules.headers.required(),
};
