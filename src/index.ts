import express, { type Express } from "express";
import { env, type Env } from "@/config/env.config";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import authRouter from "./routes/auth.route";
import ErrorHandler from "./middlewares/error.middleware";
import NotFoundMiddleware from "./middlewares/not-found.middleware";
import { apiLimiter, loginLimiter } from "./middlewares/ratelimit.middleware";
import postRouter from "./routes/post.route";
const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", loginLimiter, authRouter);
app.use("/api/v1/posts", apiLimiter, postRouter);
app.use(NotFoundMiddleware.handle);
app.use(ErrorHandler.handle);

const PORT: Env["PORT"] = env.PORT;
const NODE_ENV: Env["NODE_ENV"] = env.NODE_ENV;

app.listen(PORT, () =>
  console.log(`server run port ${PORT} in ${NODE_ENV} mode.`)
);
