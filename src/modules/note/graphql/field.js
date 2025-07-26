import { GraphQLID, GraphQLInt, GraphQLNonNull } from "graphql";
import { PaginatedNotesType } from "./type.js";
import { getNote } from "./resolve.js";

export const getNotesQuery = {
  type: PaginatedNotesType,
  args: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
  },
  resolve: getNote,
};