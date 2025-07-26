
import noteModel from "../../../DB/models/note.model.js";

export const getNote = async (parent,args) => {
    const { userId, page = 1, limit = 5 } = args;

  const skip = (page - 1) * limit;

  const notes = await noteModel.find({ userId })
    .skip(skip)
    .limit(limit);

  const totalCount = await noteModel.countDocuments({ userId });

  return {
    notes,
    totalCount,
    currentPage: page,
    hasNextPage: skip + notes.length < totalCount
  };
};
