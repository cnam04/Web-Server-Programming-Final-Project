import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") ?? true
}));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "server", time: new Date().toISOString() });
});

app.get("/", (_req, res) =>{
    res.json({ok: true, time: new Date().toISOString()})
    res.status(200)
})

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});