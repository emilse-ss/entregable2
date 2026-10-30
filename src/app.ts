import express from "express";
import songsRoutes from "./routes/songs.routes";

const app = express();

app.use(express.json());
app.use("/songs", songsRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "TWICE Songs API funcionando" });
});

export default app;