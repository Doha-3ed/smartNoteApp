
import cors from "cors";
import path from "path";
import connectionDb from "./DB/dbConnection.js";
import { generalLimiter } from "./middleware/rateLimit.js";
import helmet from "helmet";
import { errorHandling } from "./utilities/globalErrorHandling.js";
import { expiredOTPs } from "./utilities/CRON.js";
import { schema } from "./modules/note/graphql.schema.js";
import { createHandler } from "graphql-http/lib/use/express"
import userRouter from "./modules/user/user.controller.js";
import noteRouter from "./modules/note/note.contoller.js";


const bootStrap = (express, app) => {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use("/graphql", createHandler({ schema }));
  app.set("strict routing", true);
  app.set("case sensitive routing", true);
  app.use("/downloads", express.static(path.resolve("downloads")));

  expiredOTPs();
   connectionDb();
   app.use(generalLimiter);
   app.use("/user",userRouter)
   app.use("/notes",noteRouter)
   app.get("/",(req, res, next) => {
    res.status(200).json({msg:"Welcome in smart note App"})
  })
  
 app.use( (req, res, next) => {
    return next(new Error("invalid URL"));
  });
  app.use(errorHandling);
  
}
export default bootStrap;
