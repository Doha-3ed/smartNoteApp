import {
  GraphQLObjectType,
  GraphQLString,
 
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  
} from "graphql";
export const getNoteType = new GraphQLObjectType({
  name: "Note",
  fields: {
    content: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    userId:{type: new GraphQLNonNull(GraphQLID)},
  },
});

export const PaginatedNotesType = new GraphQLObjectType({
  name: "PaginatedNotes",
  fields: {
    notes: { type: new GraphQLNonNull(new GraphQLList(getNoteType)) },
    totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    currentPage: { type: new GraphQLNonNull(GraphQLInt) },
    hasNextPage: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
});
