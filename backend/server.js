const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const defaultOrigins = ["http://localhost:3000", "http://localhost:3001"];
let ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean)
  : defaultOrigins.slice();

if (process.env.FRONTEND_URL) {
  ALLOWED_ORIGINS.push(process.env.FRONTEND_URL);
}

ALLOWED_ORIGINS = Array.from(new Set(ALLOWED_ORIGINS));
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/blogDB";

app.use(express.json());
app.use(cors({ origin: ALLOWED_ORIGINS }));

console.log("Allowed CORS origins:", ALLOWED_ORIGINS);
if (process.env.FRONTEND_URL) console.log("FRONTEND_URL provided:", process.env.FRONTEND_URL);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

const emitRealtimeUpdate = (type, payload) => {
  io.emit("posts:changed", { type, payload, at: new Date().toISOString() });
};

const parsePayload = (body) => {
  const title = (body.title || "").trim();
  const content = (body.content || "").trim();

  if (!title || !content) {
    return { error: "Both title and content are required." };
  }

  return { title, content };
};

app.get("/health", (_, res) => {
  res.json({ ok: true, service: "blog-api" });
});

app.post("/posts", async (req, res) => {
  try {
    const parsed = parsePayload(req.body);
    if (parsed.error) {
      return res.status(400).json({ message: parsed.error });
    }

    const post = await Post.create(parsed);
    emitRealtimeUpdate("created", post);
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.get("/posts", async (_, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.put("/posts/:id", async (req, res) => {
  try {
    const parsed = parsePayload(req.body);
    if (parsed.error) {
      return res.status(400).json({ message: parsed.error });
    }

    const updated = await Post.findByIdAndUpdate(req.params.id, parsed, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Post not found" });
    }

    emitRealtimeUpdate("updated", updated);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Post not found" });
    }

    emitRealtimeUpdate("deleted", { _id: req.params.id });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});