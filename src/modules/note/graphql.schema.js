import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { getNotesQuery } from "./graphql/field.js";
export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      getNote: getNotesQuery,
    },
  }),
});