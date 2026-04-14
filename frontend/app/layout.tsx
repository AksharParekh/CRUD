import Link from "next/link";
import "./globals.css";
// Link component is used for navigation between pages (without full reload)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      {/* Root HTML tag (required in Next.js App Router) */}

      <body>
        {/* Body of the application */}

        {/* Navigation bar */}
        <nav style={{ padding: 10, background: "#fff", color: "#000", borderBottom: "1px solid #eee" }}>
          
          {/* Link to Home page */}
          <Link href="/" className="btn-link">Home</Link> |{" "}
          
          {/* Link to Blog page */}
          <Link href="/blog" className="btn-link">Blog</Link> |{" "}
          
          {/* Link to Add Blog page */}
          <Link href="/add" className="btn-link">Add Blog</Link>
        </nav>

        {/* This renders the current page content */}
        {children}

      </body>
    </html>
  );
}