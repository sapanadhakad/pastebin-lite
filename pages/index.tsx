import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [content, setContent] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [expiry, setExpiry] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content) {
      alert("Please enter some text!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content, 
          maxViews: maxViews || null, 
          expirationMinutes: expiry || null 
        }),
      });

      const data = await res.json();
      if (data.slug) {
        // This generates the link the user can share
        setLink(`${window.location.origin}/v/${data.slug}`);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to create paste");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <Head>
        <title>Pastebin Lite - Aganitha Exercise</title>
      </Head>

      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Pastebin Lite</h1>
      
      <p>Store and share text content quickly.</p>

      <textarea 
        style={{ 
          width: '100%', 
          height: '300px', 
          padding: '12px', 
          borderRadius: '8px', 
          border: '1px solid #ccc',
          fontSize: '16px',
          fontFamily: 'monospace'
        }}
        placeholder="Paste your code or text here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px' }}>Max Views (optional)</label>
          <input 
            type="number" 
            placeholder="e.g. 5" 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            onChange={(e) => setMaxViews(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px' }}>Expiration</label>
          <select 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            onChange={(e) => setExpiry(e.target.value)}
          >
            <option value="">Never Expire</option>
            <option value="10">10 Minutes</option>
            <option value="60">1 Hour</option>
            <option value="1440">1 Day</option>
          </select>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          style={{ 
            backgroundColor: '#0070f3', 
            color: 'white', 
            padding: '10px 24px', 
            borderRadius: '6px', 
            border: 'none', 
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '18px'
          }}
        >
          {loading ? 'Creating...' : 'Generate Link'}
        </button>
      </div>

      {link && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e6f6ff', borderRadius: '8px', border: '1px solid #b3e0ff' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Your shareable link is ready:</p>
          <input 
            readOnly 
            value={link} 
            style={{ width: '100%', padding: '10px', marginTop: '10px', border: '1px solid #80ccff' }}
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <p style={{ fontSize: '12px', color: '#555' }}>Click the link above to copy.</p>
          <a href={link} style={{ display: 'inline-block', marginTop: '10px', color: '#0070f3' }}>Visit Paste →</a>
        </div>
      )}
    </div>
  );
}