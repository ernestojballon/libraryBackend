import app from "./src/app.js";
import ServerlessHttp from "serverless-http";

export const handler = ServerlessHttp(app);
