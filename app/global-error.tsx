"use client";

/**
 * The last resort: an error in the root layout itself, where no styling or
 * shell is guaranteed. It ships its own minimal markup for that reason.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
          color: "#0B1F52",
          background: "#fff",
        }}
      >
        <main style={{ maxWidth: "32rem", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", margin: 0 }}>That did not work</h1>
          <p style={{ lineHeight: 1.6, color: "#4a5568" }}>
            Something on our side failed before the page could load. Nothing you had saved is lost.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1rem",
              background: "#0050B8",
              color: "#fff",
              border: 0,
              borderRadius: "0.5rem",
              padding: "0.75rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
