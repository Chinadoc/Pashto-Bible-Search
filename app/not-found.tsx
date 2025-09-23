"use client";

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      color: '#111827'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '6rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#111827'
        }}>404</h1>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#374151'
        }}>
          Page Not Found
        </h2>
        <p style={{
          marginBottom: '2rem',
          color: '#6b7280'
        }}>
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#2563eb'}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
