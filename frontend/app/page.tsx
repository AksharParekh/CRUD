export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>Lab 12 Blog App</h1>
      <p style={{ marginBottom: 12 }}>
        This practical demonstrates CRUD operations with a Next.js frontend and Node.js backend.
      </p>
      <p style={{ marginBottom: 12 }}>
        Open the Blog page to watch real-time updates appear when posts are created, edited, or deleted.
      </p>
      <ul style={{ paddingLeft: 18 }}>
        <li>Use Add Blog to create a post.</li>
        <li>Use Blog to edit and delete posts.</li>
        <li>Open multiple tabs to visualize live synchronization.</li>
      </ul>
    </main>
  );
}