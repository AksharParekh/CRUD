"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { API_BASE_URL, SOCKET_URL } from "@/lib/config";

type Post = {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};

type ChangeEvent = {
  type: "created" | "updated" | "deleted";
  payload: Post | { _id: string };
  at: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastEvent, setLastEvent] = useState<ChangeEvent | null>(null);
  const [connected, setConnected] = useState(false);

  const apiUrl = useMemo(() => `${API_BASE_URL}/posts`, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get<Post[]>(apiUrl);
      setPosts(res.data);
      setError("");
    } catch {
      setError("Could not fetch posts from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!SOCKET_URL) {
      setConnected(false);
      return;
    }

    const socket: Socket = io(SOCKET_URL, { transports: ["websocket"] });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("posts:changed", (event: ChangeEvent) => {
      setLastEvent(event);
      fetchPosts();
    });

    return () => {
      socket.disconnect();
    };
  }, [apiUrl]);

  const deletePost = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
    } catch {
      setError("Failed to delete post.");
    }
  };

  const editPost = async (id: string, oldTitle: string, oldContent: string) => {
    const newTitle = prompt("Edit title", oldTitle);
    const newContent = prompt("Edit content", oldContent);
    if (!newTitle || !newContent) {
      return;
    }

    try {
      await axios.put(`${apiUrl}/${id}`, {
        title: newTitle,
        content: newContent,
      });
    } catch {
      setError("Failed to update post.");
    }
  };

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Blog Feed</h1>
      <p style={{ marginBottom: 14, color: "#444" }}>
        Real-time status: {SOCKET_URL ? (connected ? "Connected" : "Disconnected") : "Disabled"}
      </p>

      {lastEvent && (
        <div
          style={{
            marginBottom: 16,
            border: "1px solid #b3e5fc",
            background: "#e1f5fe",
            borderRadius: 8,
            padding: 10,
          }}
        >
          Last update: {lastEvent.type} at {new Date(lastEvent.at).toLocaleTimeString()}
        </div>
      )}

      {error && <p style={{ color: "#b00020" }}>{error}</p>}
      {loading && <p>Loading posts...</p>}

      {!loading && posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((p) => (
        <article
          key={p._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            marginBottom: 12,
            padding: 12,
            background: "white",
          }}
        >
          <h3 style={{ marginBottom: 8 }}>{p.title}</h3>
          <p style={{ marginBottom: 10 }}>{p.content}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => editPost(p._id, p.title, p.content)} style={{ padding: "6px 10px" }}>
              Edit
            </button>
            <button onClick={() => deletePost(p._id)} style={{ padding: "6px 10px" }}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </main>
  );
}