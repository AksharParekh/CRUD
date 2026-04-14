"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

export default function AddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const addPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await axios.post(`${API_BASE_URL}/posts`, { title, content });
      router.push("/blog");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Failed to create post."
        : "Failed to create post.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Add Blog Post</h1>
      <p style={{ marginBottom: 16, color: "#444" }}>Create a post and it will appear instantly on all connected clients.</p>

      <form onSubmit={addPost} style={{ display: "grid", gap: 12 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          required
          style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10 }}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post content"
          required
          rows={8}
          style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10, resize: "vertical" }}
        />

        {error && <p style={{ color: "#b00020" }}>{error}</p>}

        <button
          type="submit"
          disabled={saving}
          style={{
            background: "#0a66c2",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 16px",
            width: "fit-content",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.8 : 1,
          }}
        >
          {saving ? "Saving..." : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle("Real-time Collaboration in Next.js");
            setContent(
              `This post demonstrates a sample article used to show how the Next.js frontend and Node.js backend synchronize in real time via Socket.IO.\n\nHighlights:\n- Live updates across open clients\n- Simple CRUD operations\n- Small, focused demo content for testing and presentation.`
            );
          }}
          style={{
            background: "transparent",
            color: "#0a66c2",
            border: "1px dashed #0a66c2",
            borderRadius: 8,
            padding: "8px 12px",
            width: "fit-content",
            cursor: "pointer",
          }}
        >
          Use sample content
        </button>
      </form>
    </main>
  );
}