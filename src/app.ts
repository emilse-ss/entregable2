import express from "express";
import songsRoutes from "./routes/songs.routes";
import { requestLogger } from "./middlewares/requestLogger";
import { errorHandler, notFound } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use("/songs", songsRoutes);
app.get("/", (_req, res) => {
  res.json({ message: "TWICE Songs API funcionando" });
});
app.use(notFound);
app.use(errorHandler);

export default app;